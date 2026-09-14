param([string]$Root = (Split-Path -Parent $PSScriptRoot))

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
if (-not ('CardBackground' -as [type])) {
    Add-Type -ReferencedAssemblies 'System.Drawing' -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public static class CardBackground {
    public static void RemoveExteriorWhite(Bitmap bitmap) {
        int width = bitmap.Width, height = bitmap.Height;
        var rect = new Rectangle(0, 0, width, height);
        var data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        try {
            int stride = data.Stride;
            byte[] pixels = new byte[stride * height];
            Marshal.Copy(data.Scan0, pixels, 0, pixels.Length);
            bool[] seen = new bool[width * height];
            int[] queue = new int[width * height];
            int head = 0, tail = 0;

            Func<int, int, bool> isExteriorWhite = (x, y) => {
                int i = y * stride + x * 4;
                int b = pixels[i], g = pixels[i + 1], r = pixels[i + 2];
                int max = Math.Max(r, Math.Max(g, b));
                int min = Math.Min(r, Math.Min(g, b));
                return pixels[i + 3] > 0 && min >= 245 && max - min <= 5;
            };
            Action<int, int> seed = (x, y) => {
                int p = y * width + x;
                if (!seen[p] && isExteriorWhite(x, y)) { seen[p] = true; queue[tail++] = p; }
            };
            for (int x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
            for (int y = 1; y < height - 1; y++) { seed(0, y); seed(width - 1, y); }

            while (head < tail) {
                int p = queue[head++], x = p % width, y = p / width;
                int i = y * stride + x * 4;
                pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
                pixels[i + 3] = 0;
                if (x > 0) seed(x - 1, y);
                if (x + 1 < width) seed(x + 1, y);
                if (y > 0) seed(x, y - 1);
                if (y + 1 < height) seed(x, y + 1);
            }
            Marshal.Copy(pixels, 0, data.Scan0, pixels.Length);
        }
        finally { bitmap.UnlockBits(data); }
    }

    public static void KeepLargestOpaqueComponent(Bitmap bitmap) {
        int width = bitmap.Width, height = bitmap.Height;
        var rect = new Rectangle(0, 0, width, height);
        var data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        try {
            int stride = data.Stride;
            byte[] pixels = new byte[stride * height];
            Marshal.Copy(data.Scan0, pixels, 0, pixels.Length);
            bool[] seen = new bool[width * height];
            bool[] keep = new bool[width * height];
            int[] queue = new int[width * height];
            List<int> largest = new List<int>();
            for (int start = 0; start < width * height; start++) {
                if (seen[start] || pixels[(start / width) * stride + (start % width) * 4 + 3] <= 8) continue;
                var component = new List<int>();
                int head = 0, tail = 0; queue[tail++] = start; seen[start] = true;
                while (head < tail) {
                    int p = queue[head++], x = p % width, y = p / width;
                    component.Add(p);
                    int[] neighbors = { p - 1, p + 1, p - width, p + width };
                    for (int n = 0; n < 4; n++) {
                        int q = neighbors[n];
                        if (q < 0 || q >= width * height || seen[q]) continue;
                        int qx = q % width, qy = q / width;
                        if ((n == 0 || n == 1) && qy != y) continue;
                        if (pixels[qy * stride + qx * 4 + 3] <= 8) continue;
                        seen[q] = true; queue[tail++] = q;
                    }
                }
                if (component.Count > largest.Count) largest = component;
            }
            foreach (int p in largest) keep[p] = true;
            for (int p = 0; p < width * height; p++) {
                if (keep[p]) continue;
                int x = p % width, y = p / width;
                pixels[y * stride + x * 4 + 3] = 0;
            }
            Marshal.Copy(pixels, 0, data.Scan0, pixels.Length);
        }
        finally { bitmap.UnlockBits(data); }
    }
}
'@
}
$outDir = Join-Path $Root 'assets\cards'
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# Эти позиции являются дублями либо заменены более поздними исправленными листами.
$excluded = [System.Collections.Generic.HashSet[string]]::new([string[]]@(
    'sheet-05-card-01.png', 'sheet-05-card-02.png',
    'sheet-06-card-01.png', 'sheet-06-card-02.png', 'sheet-06-card-03.png', 'sheet-06-card-04.png',
    'sheet-08-card-01.png', 'sheet-08-card-02.png', 'sheet-08-card-05.png', 'sheet-08-card-06.png',
    'sheet-09-card-01.png', 'sheet-09-card-02.png', 'sheet-09-card-03.png', 'sheet-09-card-04.png',
    'sheet-09-card-05.png', 'sheet-09-card-06.png', 'sheet-09-card-07.png', 'sheet-09-card-08.png',
    'sheet-10-card-06.png',
    'sheet-11-card-03.png',
    'sheet-12-card-01.png', 'sheet-12-card-03.png', 'sheet-12-card-04.png',
    'sheet-12-card-05.png', 'sheet-12-card-06.png', 'sheet-12-card-07.png', 'sheet-12-card-08.png',
    'sheet-13-card-01.png', 'sheet-13-card-02.png',
    'sheet-14-card-08.png',
    'sheet-15-card-01.png', 'sheet-15-card-02.png', 'sheet-15-card-03.png',
    'sheet-15-card-04.png', 'sheet-15-card-05.png', 'sheet-15-card-06.png',
    'sheet-16-card-02.png'
))

# Ручные безопасные границы для карточек, которым тесна общая сетка.
# Координаты включают всю белую волнистую окантовку, но заканчиваются до соседнего стикера.
$cropOverrides = @{
    'sheet-04-card-07.png' = @(18, 920, 622, 1254)
    'sheet-06-card-05.png' = @(18, 610, 622, 920)
    'sheet-07-card-08.png' = @(620, 905, 1248, 1254)
    'sheet-08-card-04.png' = @(625, 315, 1248, 620)
    'sheet-10-card-07.png' = @(18, 920, 622, 1254)
    'sheet-11-card-05.png' = @(18, 620, 622, 902)
    'sheet-11-card-06.png' = @(625, 620, 1248, 902)
    'sheet-14-card-07.png' = @(615, 620, 924, 1110)
}

foreach ($sheetNumber in 1..19) {
    $source = Join-Path $Root "$sheetNumber.png"
    $image = [System.Drawing.Bitmap]::FromFile($source)
    try {
        if ($sheetNumber -eq 1) {
            $xRanges = @(@(0, 554), @(568, 1122))
            $yRanges = @(@(0, 386), @(388, 708), @(710, 1032), @(1034, 1402))
        }
        elseif ($sheetNumber -le 3) {
            $xRanges = @(@(0, 554), @(568, 1122))
            $yRanges = @(@(0, 352), @(356, 681), @(685, 1001), @(1002, 1402))
        }
        elseif ($sheetNumber -le 11) {
            $xRanges = @(@(0, 620), @(634, 1254))
            $yRanges = @(@(0, 320), @(325, 625), @(628, 933), @(938, 1254))
        }
        elseif ($sheetNumber -in 15, 17) {
            $xRanges = @(@(0, 410), @(422, 832), @(844, 1254))
            $yRanges = @(@(0, 610), @(635, 1254))
        }
        elseif ($sheetNumber -eq 19) {
            $xRanges = @(@(0, 331), @(342, 674), @(685, 1017), @(1028, 1357))
            $yRanges = @(@(0, 568), @(588, 1159))
        }
        else {
            $xRanges = @(@(0, 307), @(315, 622), @(630, 937), @(945, 1254))
            $yRanges = @(@(0, 610), @(635, 1254))
        }

        $columns = $xRanges.Count
        $rows = $yRanges.Count

        $cardNumber = 0
        for ($row = 0; $row -lt $rows; $row++) {
            for ($column = 0; $column -lt $columns; $column++) {
                $cardNumber++
                $left = $xRanges[$column][0]
                $right = $xRanges[$column][1]
                $top = $yRanges[$row][0]
                $bottom = $yRanges[$row][1]
                $name = 'sheet-{0:d2}-card-{1:d2}.png' -f $sheetNumber, $cardNumber
                if ($excluded.Contains($name)) { continue }
                if ($cropOverrides.ContainsKey($name)) {
                    $bounds = $cropOverrides[$name]
                    $left = $bounds[0]; $top = $bounds[1]; $right = $bounds[2]; $bottom = $bounds[3]
                }
                $rect = New-Object System.Drawing.Rectangle $left, $top, ($right - $left), ($bottom - $top)
                $card = $image.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
                try {
                    [CardBackground]::RemoveExteriorWhite($card)
                    if ($cropOverrides.ContainsKey($name)) {
                        [CardBackground]::KeepLargestOpaqueComponent($card)
                    }
                    if ($name -eq 'sheet-19-card-03.png') {
                        $graphics = [System.Drawing.Graphics]::FromImage($card)
                        try {
                            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
                            $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
                            $banner = [System.Drawing.Point[]]@(
                                [System.Drawing.Point]::new(38, 101), [System.Drawing.Point]::new(294, 105),
                                [System.Drawing.Point]::new(289, 161), [System.Drawing.Point]::new(43, 155)
                            )
                            $bannerBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 248, 247, 255))
                            $graphics.FillPolygon($bannerBrush, $banner)
                            $bannerBrush.Dispose()
                            $font = [System.Drawing.Font]::new('Arial', 19, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
                            $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(232, 25, 52))
                            $format = [System.Drawing.StringFormat]::new()
                            $format.Alignment = [System.Drawing.StringAlignment]::Center
                            $format.LineAlignment = [System.Drawing.StringAlignment]::Center
                            $bannerText = -join @(
                                [char]0x0421, [char]0x041F, '_', [char]0x0420, [char]0x0422,
                                [char]0x0410, [char]0x041A, [char]0x0418, [char]0x0410,
                                [char]0x0414, [char]0x0410
                            )
                            $graphics.DrawString($bannerText, $font, $textBrush, [System.Drawing.RectangleF]::new(40, 104, 252, 52), $format)
                            $format.Dispose(); $textBrush.Dispose(); $font.Dispose()
                        }
                        finally { $graphics.Dispose() }
                    }
                    if ($name -eq 'sheet-14-card-07.png') {
                        $graphics = [System.Drawing.Graphics]::FromImage($card)
                        try {
                            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
                            $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
                            $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
                            $clearBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::Transparent)
                            $graphics.FillRectangle($clearBrush, 304, 95, ($card.Width - 304), 355)
                            $clearBrush.Dispose()
                            $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
                            $labelBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
                            $graphics.FillRectangle($labelBrush, 294, 210, 10, 164)
                            $graphics.FillRectangle($labelBrush, 20, 350, 284, 100)
                            $labelBrush.Dispose()
                            $font = [System.Drawing.Font]::new('Arial Black', 22, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
                            $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::Black)
                            $format = [System.Drawing.StringFormat]::new()
                            $format.Alignment = [System.Drawing.StringAlignment]::Center
                            $format.LineAlignment = [System.Drawing.StringAlignment]::Center
                            $labelText = -join @(
                                [char]0x041F, [char]0x0420, [char]0x041E, [char]0x0421, [char]0x041B,
                                '_', [char]0x0412, [char]0x041B, [char]0x042F, [char]0x0422, [char]0x042C
                            )
                            $graphics.DrawString($labelText, $font, $textBrush, [System.Drawing.RectangleF]::new(24, 374, 266, 72), $format)
                            $format.Dispose(); $textBrush.Dispose(); $font.Dispose()
                        }
                        finally { $graphics.Dispose() }
                    }
                    $card.Save((Join-Path $outDir $name), [System.Drawing.Imaging.ImageFormat]::Png)
                }
                finally { $card.Dispose() }
            }
        }
    }
    finally { $image.Dispose() }
}

foreach ($name in $excluded) {
    Remove-Item -LiteralPath (Join-Path $outDir $name) -ErrorAction SilentlyContinue
}

# Новые одиночные иллюстрации уже являются готовыми карточками, поэтому сеточная
# нарезка им не нужна. Удаляется только связанный с краями внешний белый фон.
$standaloneNumbers = @(20, 21, 22, 23, 24, 25, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37)
foreach ($number in $standaloneNumbers) {
    $source = Join-Path $Root "$number.png"
    $image = [System.Drawing.Bitmap]::FromFile($source)
    try {
        $card = $image.Clone(
            [System.Drawing.Rectangle]::new(0, 0, $image.Width, $image.Height),
            [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
        )
        try {
            [CardBackground]::RemoveExteriorWhite($card)
            $card.Save((Join-Path $outDir "standalone-$number.png"), [System.Drawing.Imaging.ImageFormat]::Png)
        }
        finally { $card.Dispose() }
    }
    finally { $image.Dispose() }
}

Write-Output "Created $((Get-ChildItem -LiteralPath $outDir -Filter '*.png').Count) card crops in $outDir"

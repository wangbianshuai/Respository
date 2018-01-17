using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MouseSync.Code
{
    public class ImageSync
    {
        public static byte[] GetControlBitmap(System.Windows.FrameworkElement control)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                System.Windows.Media.Imaging.BitmapEncoder encoder = new System.Windows.Media.Imaging.PngBitmapEncoder();
                System.Windows.Media.Imaging.RenderTargetBitmap bitmap = new System.Windows.Media.Imaging.RenderTargetBitmap(Convert.ToInt32(control.ActualWidth), Convert.ToInt32(control.ActualHeight), 0, 0, System.Windows.Media.PixelFormats.Default);
                bitmap.Render(control);

                encoder.Frames.Add(System.Windows.Media.Imaging.BitmapFrame.Create(bitmap));
                encoder.Save(ms);

                return ms.ToArray();
            }
        }
    }
}

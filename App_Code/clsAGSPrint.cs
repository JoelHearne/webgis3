using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Configuration;
using System.IO;
using System.Reflection;
using System.Collections.Specialized;
//using System.Threading.Tasks;
using System.Globalization;
using System.Diagnostics;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using PdfSharp.Drawing;
using System.Net;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Collections;
using System.Data.SqlClient;
using System.Data.Sql;
using System.Data.SqlTypes;
using System.Data;
using System.IO;
using System.Reflection;




namespace Mapserv
{
    public class clsAGSPrint
    {

        public String mapImagePth = "";
        public String mapImageURL = "";
        public String ovmapImagePth = "";
        public String PDFPth = "";
        public String pin = "";
        public double minx = 100000000;
        public double miny = 100000000;
        public double maxx = -100000000;
        public double maxy = -100000000;
        public CAMVIEW_ParcelMapreport obCama = null;

        private static String outDir = ConfigurationManager.AppSettings["OutputLocation"];
        private DirectoryInfo di = new System.IO.DirectoryInfo(outDir);
        private String mapfilepath = ConfigurationManager.AppSettings["MapFileLocation"];
        private String baseOutputURL = ConfigurationManager.AppSettings["baseOutputURL"];
        private String cgis_connstr = ConfigurationManager.AppSettings["CGIS_CONNSTR"];
        private String ovmapImageTPth = ConfigurationManager.AppSettings["ovmapImageTPth"];
        private String northimgpth = ConfigurationManager.AppSettings["ovNorthArrImageTPth"];

        private Image mimg = null;
        //Stopwatch timer = new Stopwatch();
        //double freq = Stopwatch.Frequency;
        //double nansecpertick = (1000 * 1000 * 1000) / freq;
        //double durNanSec = timer.ElapsedTicks * nansecpertick;

        public clsAGSPrint() { }

        public clsAGSPrint(String query_pin)
        {
            pin = query_pin;

        }

        public void DoIt()
        {


            //timer.Start();
            InitMap();
            //long tm1 = timer.ElapsedMilliseconds;
            //Debug.Print(String.Format("InitMap   {0} millisec", timer.ElapsedMilliseconds));
            //timer.Reset();

            //timer.Start();
            QueryCentralGIS();
            //long tm2 = timer.ElapsedMilliseconds;
            //Debug.Print(String.Format("QueryCentralGIS   {0} millisec", timer.ElapsedMilliseconds));
           // timer.Reset();

            //timer.Start();
            GeneratePrintLayout();
            //long tm3 = timer.ElapsedMilliseconds;

            //Debug.Print(String.Format("InitMap   {0} QueryCentralGIS   {1} GeneratePrintLayout   {2} millisec", tm1, tm2, tm3));
            //timer.Reset();

        }

        public void InitMap()
        {

            //map.setSize(663, 618);
            // build AGS Export Rest request

            // need bbox for parcel - two ways to do it

            // #1 - get bbox using pure Rest - still need to parse geometry and derive bbox
            String rStr = String.Format("http://204.49.20.75:6080/arcgis/rest/services/internet_webgis/MapServer/2/query?where=PATPCL_PIN%3D%27{0}%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson", pin);
            // String rStr = String.Format("http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer/13/query?where=PIN_DSP%3D%27{0}%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson", pin);

            //timer.Start();

            String qresp = SendRestReq(rStr);
            //long tm1 = timer.ElapsedMilliseconds;
            // timer.Reset();

            // timer.Start();


            JavaScriptSerializer serializer = new JavaScriptSerializer();
            AGSQuery so = serializer.Deserialize<AGSQuery>(qresp);

            // long tm2 = timer.ElapsedMilliseconds;
            //Debug.Print(String.Format("SendRestReq   {0}  SerializeReq {1}", tm1,tm2));
            //timer.Reset();

            // timer.Start();
            for (int i = 0; i < so.features[0].geometry.rings[0].Count; i++)
            {
                double x = so.features[0].geometry.rings[0][i][0];
                double y = so.features[0].geometry.rings[0][i][1];

                if (x > maxx)
                {
                    maxx = x;
                }
                else if (x < minx)
                {
                    minx = x;
                }

                if (y > maxy)
                {
                    maxy = y;
                }
                else if (y < miny)
                {
                    miny = y;
                }
            }

            //TODO: zoom out a little bit
            double zoom_factr = 6.3;
            double wid = maxx - minx;
            double hgt = maxy - miny;
            double dx = (zoom_factr * wid) / 2;
            double dy = (zoom_factr * hgt) / 2;
            minx = minx - dx;
            maxx = maxx + dx;
            miny = miny - dx;
            maxy = maxy + dx;


            String extStr = String.Format("{0},{1},{2},{3}", minx, miny, maxx, maxy);
            //long tm3 = timer.ElapsedMilliseconds;
            //Debug.Print(String.Format("SendRestReq   {0}\r\n  SerializeReq   {1}\r\n  parse extent   {2}\r\n", tm1,tm2,tm3));
            //timer.Reset();

            // Option #2 - DB query




            // EXPORT REQUEST

            String imgSz = "600,500";
            imgSz = "660,620";
            //imgSz = "825,775";
            //imgSz = "990,930";
            //parcel map
            /*
            String reqStr1 = String.Format("http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Parcels/MapServer/export?bbox={0}&bboxSR=&layers=hide:0,2,14,15&", extStr);
            String reqStr2= "layerDefs={%2213%22%3A%22PIN_DSP+%3D+%27" + pin + "%27%22+}" ;
            String reqStr3= "&size=" + imgSz + "&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=pjson";
            String reqStr = reqStr1 + reqStr2 + reqStr3;
            */
            /*
            String reqStr1 = String.Format("http://204.49.20.75:6080/arcgis/rest/services/PA_Services/pa_map/MapServer/export?bbox={0}&bboxSR=&layers=&", extStr);
            String reqStr2 = "layerDefs={%221%22%3A%22PATPCL_PIN+%3D+%27" + pin + "%27%22+}";
            String reqStr3 = "&size=" + imgSz + "&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=json";
            String reqStr = reqStr1 + reqStr2 + reqStr3;
            */
            String reqStr1 = String.Format("http://204.49.20.75:6080/arcgis/rest/services/PA_Services/pa_map_ortho/MapServer/export?bbox={0}&bboxSR=&layers=&", extStr);
            String reqStr2 = "layerDefs={%2212%22%3A%22PATPCL_PIN+%3D+%27" + pin + "%27%22+}";
            String reqStr3 = "&size=" + imgSz + "&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=image";
            String reqStr = reqStr1 + reqStr2 + reqStr3;


            GetMapImage(ref   mimg, reqStr);

            //Debug.Print(reqStr);
            /*
            timer.Start();
             qresp = SendRestReq(reqStr);
             long tm4 = timer.ElapsedMilliseconds;
             //Debug.Print(String.Format("SendRestReq   {0}\r\n  SerializeReq   {1}\r\n  parse extent   {2}\r\nGetImage Req {3}", tm1,tm2,tm3,tm4));
             timer.Reset();




             serializer = new JavaScriptSerializer();
             Export eo = serializer.Deserialize<Export>(qresp);

             mapImageURL = eo.href;

             timer.Start();
             WebRequest requestPic = WebRequest.Create(mapImageURL);
             WebResponse responsePic = requestPic.GetResponse();

             Image webImage = Image.FromStream(responsePic.GetResponseStream());
             long tm5 = timer.ElapsedMilliseconds;
             //Debug.Print(String.Format("SendRestReq   {0}\r\n  SerializeReq   {1}\r\n  parse extent   {2}\r\nGetImage Req {3} download image {4}", tm1,tm2,tm3,tm4,tm5));
             timer.Reset();
            
            */

            // raster

            //String rastReq = String.Format("http://204.49.20.76:6080/arcgis/rest/services/PA_Services/2013Images/MapServer/export?bbox={0}&bboxSR=&layers=&layerDefs=&size={1}&imageSR=&format=png32&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=pjson", extStr, imgSz);
            //String rastReq = String.Format("http://204.49.20.75/arcgis/rest/services/Pictometry_2013_OrthoMosaic/ImageServer/exportImage?bbox={0}&bboxSR=&layers=&layerDefs=&size={1}&imageSR=&format=jpg&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=pjson", extStr, imgSz);

            String rastReq = String.Format("http://204.49.20.75/arcgis/rest/services/Pictometry_2013_OrthoMosaic/ImageServer/exportImage?bbox={0}&bboxSR=102660&size={1}&imageSR=&time=&format=jpg&pixelType=U8&noData=&noDataInterpretation=esriNoDataMatchAny&interpolation=+RSP_BilinearInterpolation&compressionQuality=&bandIds=&mosaicRule=&renderingRule=&f=pjson", extStr, imgSz);

            /*
            qresp = SendRestReq(rastReq);
             serializer = new JavaScriptSerializer();
             Export eoo = serializer.Deserialize<Export>(qresp);

             WebRequest requestPic2 = WebRequest.Create(eoo.href);
             WebResponse responsePic2 = requestPic2.GetResponse();

             Image webImage2 = Image.FromStream(responsePic2.GetResponseStream());
            
           //responsePic2.ContentLength
                        //responsePic2.ContentType
             String strHeaders="";
             foreach (String strHeader in responsePic2.Headers) {
                    strHeaders +=  " - " + responsePic2.Headers[strHeader]  ;
 
 
             }
             
             using (Graphics g = Graphics.FromImage(webImage2))
             {
                 g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                 g.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;
                 //g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                 g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
               
                 
                 g.DrawImageUnscaled(webImage, 0, 0);
             }
            */



            // TODO: Maybe also get raster image and compost them together here



            // sales query
            //http://204.49.20.76:6080/arcgis/rest/services/PA_Services/Sales/MapServer/export?bbox=1291809.63777347%2C537494.868928192%2C1292208.52641136%2C537929.658084842&bboxSR=&layers=show%3A0%2C4%2C8%2C12&layerDefs=&size=660%2C620&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=html


           // timer.Start();
            String nome = String.Empty;
            String ovnome = String.Empty;

            Random rand = new Random(DateTime.Now.Millisecond);

            nome = rand.Next().ToString() + ".jpg";
            ovnome = rand.Next().ToString() + "_ov.jpg";

            mapImagePth = di.FullName + nome;
            ovmapImagePth = di.FullName + ovnome;

            /*
             //webImage2.Save(mapImagePth);
             webImage.Save(mapImagePth);
             long tm6 = timer.ElapsedMilliseconds;
             Debug.Print(String.Format("SendRestReq   {0}\r\nSerializeReq   {1}\r\nparse extent   {2}\r\nGetImage Req {3}\r\ndownload image {4}\r\nsave image {5}", tm1,tm2,tm3,tm4,tm5,tm6));
             timer.Reset();
            */
            // execute rest request

            // parse "href" out of JSON response

            // Get image result

            // generate report



        }

        public void GeneratePrintLayout()
        {

            //mapImagePth
            DateTime now = DateTime.Now;

            String tmpPdfFile = @"c:\inetpub\wwwroot\ms6\output\QPMapTemplate.pdf";
            tmpPdfFile = @"c:\inetpub\wwwroot\ms6\output\property4.pdf";
            string filename = "MixMigraDocAndPdfSharp.pdf";
            filename = Guid.NewGuid().ToString("D").ToUpper() + ".pdf";

            PDFPth = di.FullName + filename;


            //Configuration config = WebConfigurationManager.OpenWebConfiguration("~/");
            /*
            PdfDocument PDFDoc = PdfReader.Open(tmpPdfFile, PdfDocumentOpenMode.Import);
            PdfDocument document = new PdfDocument();


            for (int Pg = 0; Pg < PDFDoc.Pages.Count; Pg++)
            {
                PdfPage pp = document.AddPage(PDFDoc.Pages[Pg]);
            }

            */

            PdfDocument document = new PdfDocument();
            PdfPage page = document.AddPage();
            page.Orientation = PdfSharp.PageOrientation.Portrait;


            document.Info.Title = "Okaloosa County GIS";
            document.Info.Author = "Okaloosa County GIS";
            document.Info.Subject = "Okaloosa County GIS Property Report";
            document.Info.Keywords = "Okaloosa County,GIS,Property,Report";


            GenerateReport(document);

            //SamplePage1(document);

            //SamplePage2(document);


            Debug.WriteLine("seconds=" + (DateTime.Now - now).TotalSeconds.ToString());

            // Save the document...
            document.Save(di.FullName + filename);


        }


        public void GetMapImage(ref Image img, String agsurl)
        {
            //Image img = null;
            var req = WebRequest.Create(agsurl);
            using (var resp = req.GetResponse())
            {
                using (var stream = resp.GetResponseStream())
                {
                    img = Image.FromStream(stream);
                }
            }
        }

        public string SendRestReq(string urlstr)
        {
            //Write2Log("qresp: " + qresp);
            String resp = "";
            WebRequest wrGETURL;
            wrGETURL = WebRequest.Create(urlstr);

            //WebProxy myProxy = new WebProxy("myproxy", 80);
            //myProxy.BypassProxyOnLocal = true;

            //wrGETURL.Proxy = WebProxy.GetDefaultProxy();
            WebResponse wr = wrGETURL.GetResponse();

            Stream objStream;
            objStream = wr.GetResponseStream();
            //Write2Log("qresp: " + qresp);
            StreamReader objReader = new StreamReader(objStream);

            string sLine = "";
            int i = 0;

            while (sLine != null)
            {
                i++;
                sLine = objReader.ReadLine();
                if (sLine != null)
                    resp += sLine;
            }

            return resp;
        }


        public void QueryCentralGIS()
        {
            obCama = new CAMVIEW_ParcelMapreport(pin);

            int sdfsdf = 0;
            /*
            DataTable dt = new DataTable();

            SqlConnection cn = null;
            SqlDataAdapter da = null;

            cn = new SqlConnection(cgis_connstr);

            try
            {
                cn.Open();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            String sqlStr = "SELECT pin ,pinstr ,owner ,site_addr ,landval ,bldval ,miscval ,justval ,exempt_val ,assdval ,taxblval ,mail_addr ,sale_info  ";
            sqlStr = sqlStr + " FROM  CAMVIEW_ParcelMapreport ";
            sqlStr = sqlStr + " WHERE pin='" + pin + "'";

            SqlCommand cmd = new SqlCommand(sqlStr, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);

            // process results

            cn.Close();
            */

        }






        private static double ApplyTransform(double previous)
        {
            return previous * .6538;
        }



        /// <summary>
        /// Renders a single paragraph.
        /// </summary>
        void GenerateReport(PdfDocument document)
        {
            //PdfPage page = document.AddPage();
            PdfPage page = document.Pages[0];

            XGraphics gfx = XGraphics.FromPdfPage(page);
            // HACK²
            gfx.MUH = PdfFontEncoding.Unicode;
            gfx.MFEH = PdfFontEmbedding.Default;

            XFont font = new XFont("Verdana", 4, XFontStyle.Regular);





            // map image origin
            //gfx.DrawString("O", font, XBrushes.Red, new XRect(5, 5, 108, 161), XStringFormats.Center);


            // ovmap image origin
            //gfx.DrawString("X", font, XBrushes.Red, new XRect(5, 5, 798, 1144), XStringFormats.Center);



            //gfx.DrawString("+", font, XBrushes.Red, new XRect(5, 5, 100, 1299), XStringFormats.Center);



            //XImage ximg = XImage.FromFile(mapImagePth);
            XImage ximg = XImage.FromGdiPlusImage(mimg);

            //ximg.Interpolate = true;
            Point ipt = new Point(58, 86);
            //gfx.SmoothingMode = XSmoothingMode.HighQuality;
            gfx.DrawImage(ximg, ipt);



            //gfx.DrawImage(ximg, ipt.X, ipt.Y, ApplyTransform(ximg.PointWidth), ApplyTransform(ximg.PointHeight));


            /*
            XImage ximg_ov = XImage.FromFile(ovmapImagePth);
            Point ov_ipt = new Point(398, 580);
            gfx.DrawImage(ximg_ov, ov_ipt);
            */

            //String ovmapImageTPth = @"C:\inetpub\wwwroot\ms6\output\ov\ov13_mxd_a.png";

            /*
            XImage ximg_ov = XImage.FromFile(ovmapImagePth);
           
            Point ov_ipt = new Point(408, 570);
            //gfx.DrawImage(ximg_ov, ov_ipt);
            gfx.DrawImage(ximg_ov, ov_ipt.X, ov_ipt.Y,97,130);
            */
            /*
            double rminx = 1218342.661;
            double rminy = 500202.9879;
            double rmaxx = 1397365.953;
            double rmaxy = 738900.7105;
            double rxw = 179023.292;
            double rxh = 238697.7226;
            double img_width = 97.0;
            double img_height = 130.0;
            */
            double rminx = 1232659.28962;
            double rminy = 498047.976697;
            double rmaxx = 1390211.37295;
            double rmaxy = 739801.448919;
            double rxw = 157552.0833;
            double rxh = 241753.4722;
            double img_width = 87;
            double img_height = 133;
            double qx = minx + ((maxx - minx) / 2.0);
            double qy = miny + ((maxy - miny) / 2.0);

            double pct_x = (qx - rminx) / rxw;
            double pct_y = (qy - rminy) / rxh;

            double px_x = pct_x * img_width;
            double px_y = (1.0 - pct_y) * img_height;

            double ul_px = ((minx - rminx) / rxw) * img_width;
            double ul_py = (1.0 - ((maxy - rminy) / rxh)) * img_height;

            double qwidth_pct = (maxx - minx) / (rmaxx - rminx);
            double qhght_pct = (maxy - miny) / (rmaxy - rminy);

            double px_width = qwidth_pct * img_width;
            double px_hgt = qhght_pct * img_height;


            //Debug.Print(String.Format("qx/qy: {0}  {1}    pct_x/pct_y: {2}  {3}   px_x/px_y:  {4}  {5} ", qx, qy, pct_x, pct_y, px_x, px_y));



            // option #1 - using graphics object directly on image
            Image ovImg = Image.FromFile(ovmapImageTPth);
            using (Graphics g = Graphics.FromImage(ovImg))
            {
                Pen myPen = new Pen(System.Drawing.Color.Red, 5);
                System.Drawing.Font myFont = new System.Drawing.Font("Helvetica", 15, FontStyle.Bold);
                Brush myBrush = new SolidBrush(System.Drawing.Color.Red);
                g.DrawString("x", myFont, myBrush, new PointF((float)px_x, (float)px_y));
                g.DrawRectangle(myPen, (float)ul_px, (float)ul_py, (float)px_width, (float)px_hgt);



            }

            ovImg.Save(ovmapImagePth);
            XImage ximg_ov = XImage.FromFile(ovmapImagePth);



            XImage ximgn = XImage.FromFile(northimgpth);

            //ximg.Interpolate = true;
            Point iptn = new Point(520, 570);
            //gfx.SmoothingMode = XSmoothingMode.HighQuality;
            gfx.DrawImage(ximgn, iptn);




            Point ov_ipt = new Point(400, 570);
            //gfx.DrawImage(ximg_ov, ov_ipt);

            //gfx.DrawImage(ximg_ov, ov_ipt.X, ov_ipt.Y, 97, 130);

            RectangleF srcR = new RectangleF(0, 0, (int)img_width, (int)img_height);
            RectangleF destR = new RectangleF(ov_ipt.X, ov_ipt.Y, (int)img_width, (int)img_height);
            gfx.DrawImage(ximg_ov, destR, srcR, XGraphicsUnit.Point);

            // option #2 - using pdf object directly on report




            // XPen peno = new XPen(XColors.Aqua, 0.5);

            //gfx.DrawRectangle(peno, 408, 570,  95,  128);

            //peno = new XPen(XColors.DodgerBlue, 0.5);

            //gfx.DrawRectangle(peno, 354, 570, 200, 128);




            XPen pen = new XPen(XColors.Black, 0.5);

            gfx.DrawRectangle(pen, 29, 59, 555, 643);


            XPen pen2 = new XPen(XColors.Black, 0.8);

            gfx.DrawRectangle(pen, 29, 566, 555, 136);


            XPen pen3 = new XPen(XColors.HotPink, 0.5);
            XBrush brush = XBrushes.LightPink;
            gfx.DrawRectangle(pen, brush, 29, 705, 555, 43);



            Document doc = new Document();



            // You always need a MigraDoc document for rendering.

            Section sec = doc.AddSection();
            // Add a single paragraph with some text and format information.
            Paragraph para = sec.AddParagraph();
            para.Format.Alignment = ParagraphAlignment.Justify;
            para.Format.Font.Name = "Verdana";
            para.Format.Font.Size = Unit.FromPoint(6);
            para.Format.Font.Color = MigraDoc.DocumentObjectModel.Colors.DarkGray;
            para.Format.Font.Color = MigraDoc.DocumentObjectModel.Colors.DarkGray;
            //para.AddText("Duisism odigna acipsum delesenisl ");
            //para.AddFormattedText("ullum in velenit", TextFormat.Bold);

            para.AddText("Okaloosa County makes every effort to produce the most accurate information possible. No warranties, expressed or implied, are provided for the data herein, its use or interpretation. The assessment information is from the last certified taxroll. All data is subject to change before the next certified taxroll. PLEASE NOTE THAT THE GIS MAPS ARE FOR ASSESSMENT PURPOSES ONLY NEITHER OKALOOSA COUNTY NOR ITS EMPLOYEES ASSUME RESPONSIBILITY FOR ERRORS OR OMISSIONS ---THIS IS NOT A SURVEY---");


            //para.Format.Borders.Distance = "1pt";
            //para.Format.Borders.Color = Colors.Orange;

            // Create a renderer and prepare (=layout) the document
            MigraDoc.Rendering.DocumentRenderer docRenderer = new DocumentRenderer(doc);
            docRenderer.PrepareDocument();

            // Render the paragraph. You can render tables or shapes the same way.  29, 705, 555, 43
            docRenderer.RenderObject(gfx, XUnit.FromPoint(38), XUnit.FromPoint(710), XUnit.FromPoint(535), para);





            Section section = doc.AddSection();




            MigraDoc.DocumentObjectModel.Tables.Table table = section.AddTable();
            table.Style = "Table";
            table.Borders.Color = MigraDoc.DocumentObjectModel.Colors.Black;
            table.Borders.Width = 0.25;

            table.Borders.Left.Width = 0.5;
            table.Borders.Right.Width = 0.5;
            table.Rows.LeftIndent = 0;
            table.Format.Font.Name = "Verdana";
            table.Format.Font.Size = Unit.FromPoint(6);
            table.Rows.Height = Unit.FromInch(0.203);
            /*
            // Before you can add a row, you must define the columns
            Column column = table.AddColumn("1cm");
            column.Format.Alignment = ParagraphAlignment.Center;

            column = table.AddColumn("2.5cm");
            column.Format.Alignment = ParagraphAlignment.Right;

            column = table.AddColumn("3cm");
            column.Format.Alignment = ParagraphAlignment.Right;

            column = table.AddColumn("3.5cm");
            column.Format.Alignment = ParagraphAlignment.Right;

            column = table.AddColumn("2cm");
            column.Format.Alignment = ParagraphAlignment.Center;

            column = table.AddColumn("4cm");
            column.Format.Alignment = ParagraphAlignment.Right;

            // Create the header of the table
            Row row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Center;
            row.Format.Font.Bold = true;
            row.Shading.Color = MigraDoc.DocumentObjectModel.Colors.Blue;
            row.Cells[0].AddParagraph("Item");
            row.Cells[0].Format.Font.Bold = false;
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[0].VerticalAlignment = VerticalAlignment.Bottom;
            row.Cells[0].MergeDown = 1;
            row.Cells[1].AddParagraph("Title and Author");
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[1].MergeRight = 3;
            row.Cells[5].AddParagraph("Extended Price");
            row.Cells[5].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[5].VerticalAlignment = VerticalAlignment.Bottom;
            row.Cells[5].MergeDown = 1;


            row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Center;
            row.Format.Font.Bold = true;
            row.Shading.Color = MigraDoc.DocumentObjectModel.Colors.BlueViolet;
            row.Cells[1].AddParagraph("Quantity");
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[2].AddParagraph("Unit Price");
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[3].AddParagraph("Discount (%)");
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[4].AddParagraph("Taxable");
            row.Cells[4].Format.Alignment = ParagraphAlignment.Left;
            */


            Column column = table.AddColumn(Unit.FromInch(0.31));
            column.Format.Alignment = ParagraphAlignment.Center;

            column = table.AddColumn(Unit.FromInch(2.0));
            column.Format.Alignment = ParagraphAlignment.Right;

            column = table.AddColumn(Unit.FromInch(0.8));
            column.Format.Alignment = ParagraphAlignment.Right;

            column = table.AddColumn(Unit.FromInch(1.0));
            column.Format.Alignment = ParagraphAlignment.Right;

            Row row = table.AddRow();
            row.HeadingFormat = true;
            row.Format.Alignment = ParagraphAlignment.Center;
            row.Format.Font.Bold = true;
            row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[0].AddParagraph("Okaloosa County Property Appraiser  -  2013 Certified Values");
            row.Cells[0].Format.Font.Bold = false;
            row.Cells[0].Format.Alignment = ParagraphAlignment.Center;
            row.Cells[0].VerticalAlignment = VerticalAlignment.Center;
            row.Cells[0].MergeRight = 3;

            row = table.AddRow();
            row.Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[0].AddParagraph("Parcel: " + obCama.pinstr);
            row.Cells[0].Format.Font.Bold = false;
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[0].VerticalAlignment = VerticalAlignment.Center;
            row.Cells[0].MergeRight = 3;


            row = table.AddRow();
            row.Cells[0].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[0].AddParagraph("Name");
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[1].AddParagraph(obCama.owner);
            row.Cells[1].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[2].AddParagraph("Land Value:");
            row.Cells[2].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[3].AddParagraph("$" + String.Format("{0:#,#######0}", obCama.landval));
            row.Cells[3].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;





            row = table.AddRow();
            row.Cells[0].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[0].AddParagraph("Site");
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[1].AddParagraph(obCama.site_addr);
            row.Cells[1].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[2].AddParagraph("Building Value");
            row.Cells[2].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[3].AddParagraph("$" + String.Format("{0:#,#######0}", obCama.bldval));
            row.Cells[3].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;



            row = table.AddRow();
            row.Cells[0].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[0].AddParagraph("Sale");
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[1].AddParagraph(obCama.sale_info);
            row.Cells[1].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[2].AddParagraph("Misc Value");
            row.Cells[2].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[3].AddParagraph("$" + String.Format("{0:#,#######0}", obCama.miscval));
            row.Cells[3].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;


            row = table.AddRow();
            row.Cells[0].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[0].AddParagraph("\nMail\n");
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[0].MergeDown = 3;

            //row.Cells[1].AddParagraph(obCama.mail_addr);
            row.Cells[1].AddParagraph(obCama.mail_addr_1);
            row.Cells[1].AddParagraph(obCama.mail_addr_2);

            row.Cells[1].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[1].Format.Alignment = ParagraphAlignment.Left;
            row.Cells[1].MergeDown = 3;

            row.Cells[2].AddParagraph("Just Value");
            row.Cells[2].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[3].AddParagraph("$" + String.Format("{0:#,#######0}", obCama.justval));
            row.Cells[3].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;


            row = table.AddRow();

            row.Cells[2].AddParagraph("Assessed Value");
            row.Cells[2].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[3].AddParagraph("$" + String.Format("{0:#,#######0}", obCama.assdval));
            row.Cells[3].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;



            row = table.AddRow();

            row.Cells[2].AddParagraph("Exempt Value");
            row.Cells[2].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[3].AddParagraph("$" + String.Format("{0:#,#######0}", obCama.exempt_val));
            row.Cells[3].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;



            row = table.AddRow();

            row.Cells[2].AddParagraph("Taxable Value");
            row.Cells[2].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)100, (byte)125, (byte)254));
            row.Cells[2].Format.Alignment = ParagraphAlignment.Left;

            row.Cells[3].AddParagraph("$" + String.Format("{0:#,#######0}", obCama.taxblval));
            row.Cells[3].Shading.Color = MigraDoc.DocumentObjectModel.Color.FromRgbColor((byte)255, new MigraDoc.DocumentObjectModel.Color((byte)255, (byte)236, (byte)255));
            row.Cells[3].Format.Alignment = ParagraphAlignment.Left;


            // Create a renderer and prepare (=layout) the document
            //MigraDoc.Rendering.DocumentRenderer docRenderer = new DocumentRenderer(doc);
            docRenderer.PrepareDocument();

            // Render the paragraph. You can render tables or shapes the same way.
            docRenderer.RenderObject(gfx, XUnit.FromInch(0.4025), XUnit.FromInch(7.88), XUnit.FromInch(3.85), table);

            //table.SetEdge(0, 0, 2, 2, Edge.Box, MigraDoc.DocumentObjectModel.BorderStyle.Single, 0.75, MigraDoc.DocumentObjectModel.Colors.Yellow);

            // table.SetEdge(0, 0, 6, 2, Edge.Box, MigraDoc.DocumentObjectModel.BorderStyle.Single, 0.75, MigraDoc.DocumentObjectModel.Colors.Yellow);


            XFont font2 = new XFont("Verdana", 5, XFontStyle.Regular);
            DateTime tdate = DateTime.Now;
            String datestr = tdate.ToString("MMM dd,yyy");
            String metadataMSG = String.Format("map created {0}", datestr);

            gfx.DrawString(metadataMSG, font2, XBrushes.Black, new XRect(480, 769, 100, 20), XStringFormats.Center);

            /*
           double xp = 0;
           double yp = 0;
           int numticks = 10;

           double w_inc = page.Width.Value / (double)numticks;
           double h_inc = page.Height.Value / (double)numticks;

           for (int x = 0; x < numticks; x++)
           {
               for (int y = 0; y < numticks; y++)
               {

                   xp = (double)x * w_inc;
                   yp = (double)y * h_inc;

                   XUnit xu_x = new XUnit(xp, XGraphicsUnit.Point);
                   XUnit xu_y = new XUnit(yp, XGraphicsUnit.Point);

                   xu_x.ConvertType(XGraphicsUnit.Inch);
                   xu_y.ConvertType(XGraphicsUnit.Inch);

                   gfx.DrawString("+", font, XBrushes.Red, new XRect( xp,  yp, 5, 5), XStringFormats.Center);
                   String lbl = String.Format("{0},{1}-{2},{3}", (int)xp, (int)yp, xu_x.Value, xu_y.Value);
                   gfx.DrawString(lbl, font, XBrushes.Red, new XRect( xp + 5,  yp + 5, 5, 5), XStringFormats.Center);


               }

           }
             */





        }





    }

    public class FieldAliases
    {
        public string OWNER_NAME { get; set; }
    }

    public class SpatialReference
    {
        public int wkid { get; set; }
        public int latestWkid { get; set; }
    }

    public class Field
    {
        public string name { get; set; }
        public string type { get; set; }
        public string alias { get; set; }
        public int length { get; set; }
    }

    public class Attributes
    {
        public string OWNER_NAME { get; set; }
    }

    public class Geometry
    {
        public List<List<List<double>>> rings { get; set; }
    }

    public class Feature
    {
        public Attributes attributes { get; set; }
        public Geometry geometry { get; set; }
    }

    public class AGSQuery
    {
        public string displayFieldName { get; set; }
        public FieldAliases fieldAliases { get; set; }
        public string geometryType { get; set; }
        public SpatialReference spatialReference { get; set; }
        public List<Field> fields { get; set; }
        public List<Feature> features { get; set; }
    }





    public class Extent
    {
        public double xmin { get; set; }
        public double ymin { get; set; }
        public double xmax { get; set; }
        public double ymax { get; set; }
        public SpatialReference spatialReference { get; set; }
    }

    public class Export
    {
        public string href { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public Extent extent { get; set; }
        public double scale { get; set; }
    }



    public class CAMVIEW_ParcelMapreport
    {

        // private String cgis_connstr = ConfigurationManager.AppSettings["CGIS_CONNSTR"];
        //private String cgis_connstr = "Server=gisvm104\\GRIZZLY;Database=Central_GIS;User Id=PA_User;Password=pa2gisuser;";
        private String cgis_connstr = ConfigurationManager.AppSettings["CGIS_CONNSTR"];

        public CAMVIEW_ParcelMapreport()
        {

        }

        public CAMVIEW_ParcelMapreport(String pinval)
        {
            this.pin = pinval.Trim();
            GetParcelRecord();
        }

        private void GetParcelRecord()
        {

            DataTable dt = new DataTable();

            SqlConnection cn = null;
            SqlDataAdapter da = null;

            cn = new SqlConnection(cgis_connstr);

            try
            {
                cn.Open();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            String sqlStr = "SELECT pin ,pinstr ,owner ,site_addr ,landval ,bldval ,miscval ,justval ,exempt_val ,assdval ,taxblval ,mail_addr ,mail_addr_1 ,mail_addr_2 ,sale_info  ";
            sqlStr = sqlStr + " FROM  CAMVIEW_ParcelMapreport ";
            sqlStr = sqlStr + " WHERE pin='" + pin + "'";

            SqlCommand cmd = new SqlCommand(sqlStr, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);

            // process results

            if (dt.Rows.Count > 0)
            {

                DataRow dr = dt.Rows[0];

                //this.pin = (String)dr["pin"];
                this.pinstr = (String)dr["pinstr"];
                this.owner = (String)dr["owner"];
                this.site_addr = (String)dr["site_addr"];
                this.landval = (decimal)dr["landval"];
                this.bldval = (decimal)dr["bldval"];
                this.miscval = (decimal)dr["miscval"];
                this.justval = (decimal)dr["justval"];
                this.exempt_val = (decimal)(dr["exempt_val"]);
                this.assdval = (decimal)dr["assdval"];
                this.taxblval = (decimal)dr["taxblval"];
                this.mail_addr = (String)dr["mail_addr"];

                this.mail_addr_1 = (String)dr["mail_addr_1"];
                this.mail_addr_2 = (String)dr["mail_addr_2"];

                this.sale_info = (String)dr["sale_info"];


            }

            cn.Close();
        }

        public string pin { get; set; }

        public string pinstr { get; set; }

        public string owner { get; set; }

        public string site_addr { get; set; }

        public decimal landval { get; set; }

        public decimal bldval { get; set; }

        public decimal miscval { get; set; }

        public decimal justval { get; set; }

        public decimal exempt_val { get; set; }

        public decimal assdval { get; set; }

        public decimal taxblval { get; set; }

        public string mail_addr { get; set; }

        public string mail_addr_1 { get; set; }

        public string mail_addr_2 { get; set; }

        public string sale_info { get; set; }

    }


}

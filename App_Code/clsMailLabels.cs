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


    public class clsMailLabels
    {
        public String PDFURL = "";
        public String search_type = "";
        public String search_string = "";
        public String PDFPth = "";
        public int qpage = 1;
        private static String outDir = ConfigurationManager.AppSettings["OutputLocation"];
        private DirectoryInfo di = new System.IO.DirectoryInfo(outDir);
        private String baseOutputURL = ConfigurationManager.AppSettings["baseOutputURL"];
        //private String cgis_connstr = ConfigurationManager.AppSettings["CGIS_CONNSTR"];
        String cgis_connstr = "Server=xxxxx;Database=xxxxx;User Id=xxxxx;Password=xxxxx;";


        private ArrayList label_al = new System.Collections.ArrayList();

        public clsMailLabels()
        {

        }

        public clsMailLabels(String searchtype, String searchstring)
        {
            search_type = searchtype;
            search_string = searchstring;
        }

        public clsMailLabels(String searchtype, String searchstring, int q_page)
        {
            search_type = searchtype;
            search_string = searchstring;
            qpage = q_page;
        }


        public void DoIt()
        {
            QueryDB();
            DrawLabels();

        }


        private void DrawLabels()
        {
            DateTime now = DateTime.Now;

            String tmpPdfFile = "";
            tmpPdfFile = @"C:\inetpub\wwwroot\ms6\output\ov\doc.pdf";

            String filename = Guid.NewGuid().ToString("D").ToUpper() + ".pdf";

            PDFPth = di.FullName + filename;

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


            document.Info.Title = "Okaloosa County Property Appraiser Mailing Labels";
            document.Info.Author = "Okaloosa County Property Appraiser";
            document.Info.Subject = "Mailing Labels";
            document.Info.Keywords = "Okaloosa County,Property,Report,Mailing Labels";


            GenerateReport(document);

            Debug.WriteLine("seconds=" + (DateTime.Now - now).TotalSeconds.ToString());

            // Save the document...
            document.Save(di.FullName + filename);


        }
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
            //gfx.DrawString("O", font, XBrushes.Red, new XRect(20, 42, 12, 12), XStringFormats.Center);

            //gfx.DrawString("O", font, XBrushes.Blue, new XRect(220,  42, 12, 12), XStringFormats.Center);

            //gfx.DrawString("O", font, XBrushes.Green, new XRect(20, 120, 12, 12), XStringFormats.Center);
            //XPen penn = new XPen(XColors.DarkSeaGreen, 1.5);
            //gfx.DrawRectangle(penn, 420, 42, 153, 63);


            // ovmap image origin
            //gfx.DrawString("X", font, XBrushes.Red, new XRect(5, 5, 798, 1144), XStringFormats.Center);



            //gfx.DrawString("+", font, XBrushes.Red, new XRect(5, 5, 100, 1299), XStringFormats.Center);


            XPen pen = new XPen(XColors.DarkTurquoise, 0.5);

            //gfx.DrawRectangle(pen, 20, 42, 150, 40);

            Document doc = new Document();
            // Create a renderer and prepare (=layout) the document
            MigraDoc.Rendering.DocumentRenderer docRenderer = new DocumentRenderer(doc);
            docRenderer.PrepareDocument();



            int numlabels = label_al.Count;
            int pagenum = 1;

            double xp = 0;
            double yp = 0;

            double x_marg = 20.0;
            double y_marg = 42.0;

            double w_inc = 200;
            double h_inc = 78;

            double label_width = 150.0;

            double rows = 3;
            double cols = 10;

            //Debug.Print(String.Format("{0} labels", numlabels));

            for (int l = 0; l < numlabels; l++)
            {
                // get label
                MailingLabel ml = (MailingLabel)label_al[l];

                // get col and row

                int irow = 1;
                int icol = 1;

                if ((l + 1) <= ((int)rows * (int)cols))
                {
                    try
                    {
                        irow = (((int)l / 3));
                        icol = (l % 3);
                    }
                    catch (Exception ex)
                    {

                    }

                    //Debug.Print(String.Format("{0}  ->  {1}   {2}", l, irow, icol));
                }
                else if ((l + 1) > (((int)rows * (int)cols)))
                {
                    //if ((l + 1) == (((int)rows * (int)cols) + 1))

                    int recpp = ((int)rows * (int)cols);
                    int modpp = (l - 1) % (recpp);
                    //Debug.Print(String.Format("{0}   mod {1}", l, modpp));
                    if (modpp == 0)
                    {
                        // print second page
                        page = document.Pages.Add();
                        //page = document.Pages[1];
                        gfx = XGraphics.FromPdfPage(page);
                        // HACK²
                        gfx.MUH = PdfFontEncoding.Unicode;
                        gfx.MFEH = PdfFontEmbedding.Default;
                        pagenum++;
                        Debug.Print(String.Format("   pagenum {0}", pagenum));
                    }

                    try
                    {
                        irow = (((l - ((pagenum - 1) * 30)) / 3)) - 1;
                        icol = ((l - ((pagenum - 1) * 30)) % 3);
                    }
                    catch (Exception ex)
                    {

                    }
                }

                double xloc = x_marg + (icol * w_inc);
                double yloc = y_marg + (irow * h_inc);

                //Debug.Print(String.Format("          {0}   {1}", xloc, yloc));

                //gfx.DrawRectangle(pen, xloc, yloc, 150, 60);


                Section sec = doc.AddSection();
                // Add a single paragraph with some text and format information.
                Paragraph para = sec.AddParagraph();
                para.Format.Alignment = ParagraphAlignment.Justify;
                para.Format.KeepTogether = true;

                para.Format.Font.Name = "Verdana";
                para.Format.Font.Size = Unit.FromPoint(6);
                para.Format.Font.Color = MigraDoc.DocumentObjectModel.Colors.Black;
                para.Format.Font.Bold = true;
                //para.AddText("Duisism odigna acipsum delesenisl ");
                //para.AddFormattedText("ullum in velenit", TextFormat.Bold);

                //para.AddText(ml.lname + "\r\n" + ml.laddr);

                String lbltext = "";
                lbltext += ml.lname;
                para.AddText(ml.lname);



                Paragraph para2 = sec.AddParagraph();
                if (ml.laddr_1 != "")
                {
                    lbltext += "\r\n" + ml.laddr_1;
                    //para.AddText(ml.laddr_1);
                    //para.AddLineBreak();


                    para2.Format.Alignment = ParagraphAlignment.Justify;
                    para2.Format.KeepTogether = true;

                    para2.Format.Font.Name = "Verdana";
                    para2.Format.Font.Size = Unit.FromPoint(6);
                    para2.Format.Font.Color = MigraDoc.DocumentObjectModel.Colors.Black;
                    para2.Format.Font.Bold = true;
                    para2.AddText(ml.laddr_1);

                }
                if (ml.laddr_2 != "") lbltext += "\r\n" + ml.laddr_2;
                if (ml.laddr_3 != "") lbltext += "\r\n" + ml.laddr_3;
                if (ml.lcity != "") lbltext += "\r\n" + ml.lcity + ", " + ml.lstate;
                if (ml.lcntry != "") lbltext += "\r\n" + ml.lcntry;
                if (ml.zip != "") lbltext += "\r\n" + ml.zip;

                //para.AddText(ml.lcity + ", " + ml.lstate + " " + ml.zip);
                //para.AddLineBreak();

                //para.AddText(lbltext);

                Paragraph para3 = sec.AddParagraph();
                para3.Format.Alignment = ParagraphAlignment.Justify;
                para3.Format.KeepTogether = true;

                para3.Format.Font.Name = "Verdana";
                para3.Format.Font.Size = Unit.FromPoint(6);
                para3.Format.Font.Color = MigraDoc.DocumentObjectModel.Colors.Black;
                para3.Format.Font.Bold = true;
                para3.AddText(ml.lcity + ", " + ml.lstate + " " + ml.zip);


                //para.Format.Borders.Distance = "1pt";
                //para.Format.Borders.Color = Colors.Orange;

                // Create a renderer and prepare (=layout) the document
                //MigraDoc.Rendering.DocumentRenderer docRenderer = new DocumentRenderer(doc);
                docRenderer.PrepareDocument();

                // Render the paragraph. You can render tables or shapes the same way.  29, 705, 555, 43
                docRenderer.RenderObject(gfx, XUnit.FromPoint(xloc), XUnit.FromPoint(yloc + 15.0), XUnit.FromPoint((int)label_width), para);
                docRenderer.RenderObject(gfx, XUnit.FromPoint(xloc), XUnit.FromPoint(yloc + 23.0), XUnit.FromPoint((int)label_width), para2);
                docRenderer.RenderObject(gfx, XUnit.FromPoint(xloc), XUnit.FromPoint(yloc + 31.0), XUnit.FromPoint((int)label_width), para3);
            }














            // You always need a MigraDoc document for rendering.
            /*
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

            para.AddText("BillyBob\r\n123 Deep Elem Lane");


            //para.Format.Borders.Distance = "1pt";
            //para.Format.Borders.Color = Colors.Orange;

            // Create a renderer and prepare (=layout) the document
            MigraDoc.Rendering.DocumentRenderer docRenderer = new DocumentRenderer(doc);
            docRenderer.PrepareDocument();

            // Render the paragraph. You can render tables or shapes the same way.  29, 705, 555, 43
            docRenderer.RenderObject(gfx, XUnit.FromPoint(38), XUnit.FromPoint(710), XUnit.FromPoint(535), para);

            */


            /*
           double xp = 0;
           double yp = 0;
           int numticks = 8;

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
                   //String lbl = String.Format("{0}    \r\n{1}   {2}\r\n    {3}", (int)xp, (int)yp, xu_x.Value, xu_y.Value);
                   String lbl = String.Format("{0}  {1}",xu_x.Value, xu_y.Value);
                   gfx.DrawString(lbl, font, XBrushes.Red, new XRect( xp + 5,  yp + 5, 5, 5), XStringFormats.Center);


               }

           }
             */





        }


        private void QueryDB()
        {

            String sqlStr = "SELECT * FROM CAMVIEW_PropertyList ";

            if (search_type == "pin")
            {
                sqlStr = sqlStr + " WHERE pin like '" + search_string + "%' ";
            }
            else if (search_type == "address")
            {
                sqlStr = sqlStr + "  WHERE site_address like  '" + search_string + "%' ";

            }
            else if (search_type == "street")
            {
                sqlStr = sqlStr + "  WHERE site_address like  '%" + search_string + "%' ";


            }
            else if (search_type == "owner")
            {
                sqlStr = sqlStr + " WHERE owner like '" + search_string + "%' ";


            }
            else if (search_type == "sub")
            {
                sqlStr = "";
                sqlStr = sqlStr + "SELECT  DISTINCT pl.*  FROM CAMVIEW_PropertyList pl ";
                sqlStr = sqlStr + " LEFT OUTER JOIN CAMVIEW_SubdivisionLookup sb ";
                sqlStr = sqlStr + " ON pl.PRPROP=sb.PAPROP ";
                sqlStr = sqlStr + " WHERE  SUBDDS like '%" + search_string + "%'";

            }
            else if (search_type == "bus")
            {
                sqlStr = "";
                sqlStr = sqlStr + "SELECT  DISTINCT PIN, Site_Address,LEDESC,HMSTD,Last_Sale,OWFLNAME as owner FROM CAMVIEW_PropertyList pl ";
                sqlStr = sqlStr + " LEFT OUTER JOIN dbo.PA_WBusName bs ";
                sqlStr = sqlStr + " ON pl.PRPROP=bs.owflprop ";
                sqlStr = sqlStr + " WHERE  OWFLNAME like '%" + search_string + "%'";


            }
            else if (search_type == "leg")
            {

                sqlStr = sqlStr + " WHERE  ledesc like '%" + search_string + "%'";
 
            }


            String pssql = sqlStr.Replace("SELECT", "");

            String pageSql = "SELECT * FROM ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum,  ";
            pageSql += pssql;
            pageSql += String.Format(") AS RowConstrainedResult WHERE RowNum >= {0} AND RowNum <= {1} ORDER BY RowNum ",qpage,qpage + 50);
          


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

            Debug.Print(sqlStr);

            SqlCommand cmd = new SqlCommand(pageSql, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);


            // build labels
            //MailingLabel

            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {


                    try
                    {
                        MailingLabel ml = new MailingLabel();
                        ml.laddr = (System.String)dt.Rows[i]["Site_Address"];
                        ml.lname = (System.String)dt.Rows[i]["owner"];
                        ml.laddr_1 = (System.String)dt.Rows[i]["PEFLADDR1"];
                        ml.laddr_2 = (System.String)dt.Rows[i]["PEFLADDR2"];
                        ml.laddr_3 = (System.String)dt.Rows[i]["PEFLADDR3"];
                        ml.lcity = (System.String)dt.Rows[i]["PEFLCITY"];
                        ml.lstate = (System.String)dt.Rows[i]["PEFLST"];
                        ml.lcntry = (System.String)dt.Rows[i]["PEFLCNTRY"];
                        ml.zip = (System.String)dt.Rows[i]["PEFLZIP5"];

                        ml.Cleanup();

                        label_al.Add(ml);
                    }
                    catch
                    {
                    }

                }


            }





            try
            {
                cn.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

        }





    }



    public class MailingLabel
    {
        public String lname = "";
        public String laddr = "";

        public String laddr_1 = "";
        public String laddr_2 = "";
        public String laddr_3 = "";
        public String lcity = "";
        public String lstate = "";
        public String lcntry = "";
        public String zip = "";


        public MailingLabel() { }
        public MailingLabel(String name, String addr)
        {
            lname = name;
            laddr = addr;
        }

        public void Cleanup()
        {
            this.laddr = this.laddr.Trim();
            this.lname = this.lname.Trim();
            this.laddr_1 = this.laddr_1.Trim();
            this.laddr_2 = this.laddr_2.Trim();
            this.laddr_3 = this.laddr_3.Trim();
            this.lcity = this.lcity.Trim();
            this.lstate = this.lstate.Trim();
            this.lcntry = this.lcntry.Trim();
            this.zip = this.zip.Trim();


        }

    }


}
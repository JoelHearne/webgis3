using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.IO;
using System.Globalization;
using System.Diagnostics;
using System.Text;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using PdfSharp.Drawing;
using System.Web.Configuration;
using System.Configuration;

using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Diagnostics;

/// <summary>
/// Summary description for pa
/// </summary>
[WebService(Namespace = "http://webgis.co.okaloosa.fl.us/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
// [System.Web.Script.Services.ScriptService]
public class pa : System.Web.Services.WebService {

    private String baseOutputURL = ConfigurationManager.AppSettings["baseOutputURL"];


    public pa () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }


    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public void GetPrintMap(String pin)
    {

        Mapserv.clsAGSPrint pcls = new Mapserv.clsAGSPrint(pin);
        pcls.DoIt();
        FileInfo fi = new FileInfo(pcls.PDFPth);

        String pdfUrl = baseOutputURL + fi.Name;

        //Debug.Print(pdfUrl);

        //return pdfUrl;
        System.Web.HttpContext.Current.Response.Write(pdfUrl);
    }

    /*
    [WebMethod]
    public string GetPrintMapMS(String pin) {

        Mapserv.clsMapservPrint pcls = new Mapserv.clsMapservPrint(pin);
        pcls.DoIt();
        pcls.GeneratePrintLayout();

        FileInfo fi = new FileInfo(pcls.PDFPth);

        

        String pdfUrl = baseOutputURL + fi.Name;
        return pdfUrl;
    }
    */



    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public void PrintMailingLabels(String search_type, String search_string)
    {
 
        Mapserv.clsMailLabels lb = new Mapserv.clsMailLabels(search_type, search_string);
        lb.DoIt();


        FileInfo fi = new FileInfo(lb.PDFPth);

        String pdfUrl = baseOutputURL + fi.Name;

        //Debug.Print(pdfUrl);

        //return pdfUrl;
        System.Web.HttpContext.Current.Response.Write(pdfUrl);
    }


}

using System;
using System.Collections;
using System.Collections.Generic;

using System.Collections.Specialized;
 
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Diagnostics;
using ClosedXML.Excel;
using System.Net;

public partial class SalesListExport : System.Web.UI.Page
{
 
    ArrayList qArr = new ArrayList();
    String conStr = "Server=xxxxx;Database=xxx;User Id=xxxx;Password=xxxxx;";
    String sqlStr = "";
    String sqlSort = "";
    protected void Page_Load(object sender, EventArgs e)
    {

        /*
         Invalid column name 'start'.
Invalid column name 'excel_start'.
Invalid column name 'SUBMIT'.
         */
        //string v = Request.QueryString["param"];
        NameValueCollection n = Request.QueryString;
        if (n.HasKeys())
        {
            //string k = n.GetKey(0);
            foreach (String key in n.AllKeys)
            {
                if ((key != null) && Request.QueryString[key].Trim() != "" 
                    && key != "searchType"
                    && key != "start"
                    && key != "excel_start"
                    && key != "SUBMIT"
                    )
                {
                    String operatr = " = ";
                    if (key.ToLower().Contains("start"))
                    {
                        operatr = " >= ";
                    }
                    else if (key.ToLower().Contains("end"))
                    {
                        operatr = " <= ";
                    }

                    String sval = Uri.UnescapeDataString(WebUtility.HtmlDecode(Request.QueryString[key]).Replace("+", "") );

                    if (key.ToLower().Contains("date") || key.ToLower().Contains("pin")
                        || key.ToLower().Contains("qual")
                        || key.ToLower().Contains("vacant")
                        || key.ToLower().Contains("sub")
                        || key.ToLower().Contains("type")
                        )
                    {

                        if (key.ToLower().Contains("date"))
                        {
                            String[] td1 = sval.Split('-');
                            sval = String.Format("{0}-{1}-01", td1[1], td1[0]);
                        }
                        sval = String.Format("'{0}'", sval);
                    }

                    if (key == "sectionValue")
                    {
                        operatr = " LIKE ";
                        sval = String.Format("'{0}-__-__-____-____-____'",sval);
                    }
                    if (key == "townshipValue")
                    {
                        operatr = " LIKE ";
                        sval = String.Format("'__-{0}-__-____-____-____'", sval);
                    }
                    if (key == "rangeValue")
                    {
                        operatr = " LIKE ";
                        sval = String.Format("'__-__-{0}-____-____-____'", sval);
                    }


                    qArr.Add(String.Format("{0} {1} {2}", key, operatr, sval));

                    //Response.Write("Key: " + key + " Value: " + Request.QueryString[key] + "<br>");
                }
            }
        }
 
        RunQuery();
    }

    String replaceQParamsWithFields(String qparms)
    {
        String rStr = qparms;

        rStr = rStr.Replace("subName ", "Subdivision");
        rStr = rStr.Replace("sectionValue ", "");
        rStr = rStr.Replace("townshipValue ", "");
        rStr = rStr.Replace("rangeValue ", "");
        rStr = rStr.Replace("neighborhood ", "District");
        rStr = rStr.Replace("startDate ", "SaleDate");
        rStr = rStr.Replace("endDate ", "SaleDate");
        rStr = rStr.Replace("startPrice ", "SalePrice");
        rStr = rStr.Replace("endPrice ", "SalePrice");
        rStr = rStr.Replace("startArea ", "Heated_Sq_Ft");
        rStr = rStr.Replace("endArea ", "Heated_Sq_Ft");
        rStr = rStr.Replace("startAcreage ", "acres");
        rStr = rStr.Replace("endAcreage ", "acres");
        rStr = rStr.Replace("startYrblt ", "Year_Built");
        rStr = rStr.Replace("endYrblt ", "Year_Built");
        rStr = rStr.Replace("saleQualification ", "SaleQual");
        rStr = rStr.Replace("saleVacant ", "Vacant_Impr");
        rStr = rStr.Replace("propertyType ", "LandUse");

        return rStr;
    }

    void RunQuery()
    {
        String[] qsArr = (String[])qArr.ToArray(typeof(String));
        String qcStr = String.Join(" AND ", qsArr) ;
        String qrStr=replaceQParamsWithFields(qcStr);

        sqlStr = "SELECT * FROM [CENTRAL_GIS].[dbo].[CAMVIEW_Sales] WHERE " + qrStr; // +sqlSort;
        Response.Write("<BR><BR>" + sqlStr);

        DataTable dt = new DataTable();

        SqlConnection cn = null;
        SqlDataAdapter da = null;

        cn = new SqlConnection(conStr);

        try
        {
            cn.Open();
        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString());
        }
 
        SqlCommand cmd = new SqlCommand(sqlStr, cn);

        da = new SqlDataAdapter(cmd);
        dt = new DataTable();
        DataSet dSet = new DataSet();
        da.Fill(dt);
 
        cn.Close();

        // fill table or produce Excell document
        //GridView1.DataSource = dt;
        
        //GridView1.DataBind();

          ExportAsExcel( dt);


    }

  
    private void ExportAsExcel(DataTable dt){

        XLWorkbook workbook = new XLWorkbook();
        IXLWorksheet ws=workbook.Worksheets.Add("SalesList");


        int rown = 1;
        int celln = 1;
        foreach (DataColumn col in dt.Columns)
        {
            Response.Write(col.ColumnName + "   ");
            ws.Cell(rown, celln).SetValue(col.ColumnName);
            celln++;
        }
        rown++;

        foreach (DataRow row in dt.Rows)
        {
            celln = 1;
            foreach (DataColumn column in dt.Columns)
            {
                Response.Write(row[column] + "  ");
                ws.Cell(rown, celln).SetValue(row[column]);

                celln++;
            }
            rown++;
        }


        // Prepare the response
        HttpResponse httpResponse = Response;
        httpResponse.Clear();
        httpResponse.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        httpResponse.AddHeader("content-disposition", "attachment;filename=\"Results.xlsx\"");

        // Flush the workbook to the Response.OutputStream
        using (MemoryStream memoryStream = new MemoryStream())
        {
            workbook.SaveAs(memoryStream);
            memoryStream.WriteTo(httpResponse.OutputStream);
            memoryStream.Close();
        }

        httpResponse.End();


    }

  
}
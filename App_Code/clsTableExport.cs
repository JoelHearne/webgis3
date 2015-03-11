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
using System.Configuration;
using System.Collections;
using System.Data.SqlClient;
using System.Data.Sql;
using System.Data.SqlTypes;
using System.Data;
using System.IO;
using System.Reflection;

using System.Data.SqlTypes;
 


namespace Mapserv
{

    public class TableExport
    {

        public String PDFURL = "";
        public String search_type = "";
        public String search_string = "";
        public String PDFPth = "";
        public int qpage = 1;
        public String rawSQL = "";

        private static String outDir = ConfigurationManager.AppSettings["OutputLocation"];
        private DirectoryInfo di = new System.IO.DirectoryInfo(outDir);
        private String baseOutputURL = ConfigurationManager.AppSettings["baseOutputURL"];
        //private String cgis_connstr = ConfigurationManager.AppSettings["CGIS_CONNSTR"];

        String cgis_connstr = ConfigurationManager.AppSettings["CGIS_CONNSTR"];

        private DataTable dt = null;

        //private ArrayList label_al = new System.Collections.ArrayList();

        public TableExport()
        {

        }

        public TableExport(String rawSQLStr)
        {
            rawSQL = rawSQLStr;
        }




        public void DoItRawSql()
        {
            if (this.rawSQL != "")
            {
                QueryDBRaw(this.rawSQL);
                MakeCSV();
            }
        }

        private void MakeCSV()
        {
            DateTime now = DateTime.Now;

            String tmpPdfFile = "";
            tmpPdfFile = @"C:\inetpub\wwwroot\ms6\output\ov\doc.pdf";

            String filename = Guid.NewGuid().ToString("D").ToUpper() + ".csv";

            PDFPth = di.FullName + filename;

     
            //Debug.WriteLine("seconds=" + (DateTime.Now - now).TotalSeconds.ToString());

            // Save the document...
            //document.Save(di.FullName + filename);


            CsvExport myExport = new CsvExport();




            if ((dt !=null) && dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {


                    try
                    {
                        myExport.AddRow();
                        foreach (DataColumn col in dt.Columns)
                        {
                            //Type colTp = col.GetType();
                            //String colType=col.GetType().Name;
                            //myExport[col.ColumnName] = (System.String)dt.Rows[i]["owner"];
                            myExport[col.ColumnName] = dt.Rows[i][col.ColumnName];

                        }

 

                        /*
                        myExport["owner"] = (System.String)dt.Rows[i]["owner"];
                        myExport["pin"] = (System.String)dt.Rows[i]["pin"];
                        */
                        //PIN,owner,PRUSE,PACONF, Owner_Address,LEDESC,Last_Sale,HMSTD
                        /*
                        myExport["PEFLADDR1"] = (System.String)dt.Rows[i]["PEFLADDR1"];
                        myExport["PEFLADDR2"] = (System.String)dt.Rows[i]["PEFLADDR2"];
                        myExport["PEFLADDR3"] = (System.String)dt.Rows[i]["PEFLADDR3"];
                        myExport["PEFLCITY"] = (System.String)dt.Rows[i]["PEFLCITY"];
                        myExport["PEFLST"] = (System.String)dt.Rows[i]["PEFLST"];
                        myExport["PEFLCNTRY"] = (System.String)dt.Rows[i]["PEFLCNTRY"];
                        myExport["PEFLZIP5"] = (System.String)dt.Rows[i]["PEFLZIP5"];
                         */
  
                    }
                    catch
                    {
                    }

                }


            }
            //Then you can do any of the following three output options:
            string myCsv = myExport.Export();
            myExport.ExportToFile(PDFPth);
            //byte[] myCsvData = myExport.ExportToBytes();


        }
 

        private void QueryDBRaw(String sqlStr)
        {



            dt = new DataTable();

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

            SqlCommand cmd = new SqlCommand(sqlStr, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);


            // build labels
            //MailingLabel
 
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



    public class CsvExport
    {
 

        /// <summary>
        /// To keep the ordered list of column names
        /// </summary>
        List<string> fields = new List<string>();

        /// <summary>
        /// The list of rows
        /// </summary>
        List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();

        /// <summary>
        /// The current row
        /// </summary>
        Dictionary<string, object> currentRow { get { return rows[rows.Count - 1]; } }

        /// <summary>
        /// Set a value on this column
        /// </summary>
        public object this[string field]
        {
            set
            {
                // Keep track of the field names, because the dictionary loses the ordering
                if (!fields.Contains(field)) fields.Add(field);
                currentRow[field] = value;
            }
        }






        /// <summary>
        /// Call this before setting any fields on a row
        /// </summary>
        public void AddRow()
        {
            rows.Add(new Dictionary<string, object>());
        }

        /// <summary>
        /// Converts a value to how it should output in a csv file
        /// If it has a comma, it needs surrounding with double quotes
        /// Eg Sydney, Australia -> "Sydney, Australia"
        /// Also if it contains any double quotes ("), then they need to be replaced with quad quotes[sic] ("")
        /// Eg "Dangerous Dan" McGrew -> """Dangerous Dan"" McGrew"
        /// </summary>
        string MakeValueCsvFriendly(object value)
        {
            if (value == null) return "";
            if (value is INullable && ((INullable)value).IsNull) return "";
            if (value is DateTime)
            {
                if (((DateTime)value).TimeOfDay.TotalSeconds == 0)
                    return ((DateTime)value).ToString("yyyy-MM-dd");
                return ((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss");
            }
            string output = value.ToString().Trim();
            if (output.Contains(",") || output.Contains("\""))
                output = '"' + output.Replace("\"", "\"\"") + '"';
            return output;
        }

        /// <summary>
        /// Output all rows as a CSV returning a string
        /// </summary>
        public string Export()
        {
            StringBuilder sb = new StringBuilder();

            // The header
            foreach (string field in fields)
                sb.Append(field).Append(",");
            sb.AppendLine();

            // The rows
            foreach (Dictionary<string, object> row in rows)
            {
                foreach (string field in fields)
                    sb.Append(MakeValueCsvFriendly(row[field])).Append(",");
                sb.AppendLine();
            }

            return sb.ToString();
        }

        /// <summary>
        /// Exports to a file
        /// </summary>
        public void ExportToFile(string path)
        {
            File.WriteAllText(path, Export());
        }

        /// <summary>
        /// Exports as raw UTF8 bytes
        /// </summary>
        public byte[] ExportToBytes()
        {
            return Encoding.UTF8.GetBytes(Export());
        }

    }


 

}
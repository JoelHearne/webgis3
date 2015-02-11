using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using System.Data.SqlClient;
using System.Data.Sql;
using System.Data.SqlTypes;
using System.Data;
using System.IO;
using System.Reflection;

namespace WebGIS
{

    public class CAMVIEW_SalesList
    {

        public CAMVIEW_Sales[] CAMVIEW_Sales_list;
        private ArrayList aps = new ArrayList();

        public String conStr = "Server=xxxxx;Database=xxxxx;User Id=xxxxx;Password=xxxxx;";
        public String srcView = "CAMVIEW_Sales";



        public void ExecuteSearch(CAMVIEW_Sales qryObj)
        {
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

            String sqlStr = "";
            sqlStr = sqlStr + "select * from CAMVIEW_Sales ";
            sqlStr = sqlStr + clsSqlHelper.buildWhereStr(qryObj);

            SqlCommand cmd = new SqlCommand(sqlStr, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);

            PrepResults(dt);

            cn.Close();
        }



        private void PrepResults(DataTable dt)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                CAMVIEW_Sales sr = new CAMVIEW_Sales();

                try
                {
                    sr.PRPROP = (System.String)dt.Rows[i]["PRPROP"];
                }
                catch
                {
                }

                try
                {
                    sr.PIN = (System.String)dt.Rows[i]["PIN"];
                }
                catch
                {
                }

                try
                {
                    sr.Sale_Date = (System.String)dt.Rows[i]["Sale_Date"];
                }
                catch
                {
                }

                try
                {
                    sr.Sale_Price = (System.Decimal)dt.Rows[i]["Sale_Price"];
                }
                catch
                {
                }

                try
                {
                    sr.Sale_Qual = (System.String)dt.Rows[i]["Sale_Qual"];
                }
                catch
                {
                }

                try
                {
                    sr.Book = (System.Int32)dt.Rows[i]["Book"];
                }
                catch
                {
                }

                try
                {
                    sr.Page = (System.Int32)dt.Rows[i]["Page"];
                }
                catch
                {
                }

                try
                {
                    sr.Instrument = (System.String)dt.Rows[i]["Instrument"];
                }
                catch
                {
                }

                try
                {
                    sr.Vacant_Impr = (System.String)dt.Rows[i]["Vacant_Impr"];
                }
                catch
                {
                }

                try
                {
                    sr.acres = (System.Decimal)dt.Rows[i]["acres"];
                }
                catch
                {
                }

                try
                {
                    sr.Year_Built = (System.Int32)dt.Rows[i]["Year_Built"];
                }
                catch
                {
                }

                try
                {
                    sr.Address_Street = (System.String)dt.Rows[i]["Address_Street"];
                }
                catch
                {
                }

                try
                {
                    sr.Address_House = (System.String)dt.Rows[i]["Address_House"];
                }
                catch
                {
                }

                try
                {
                    sr.Address_Type = (System.String)dt.Rows[i]["Address_Type"];
                }
                catch
                {
                }

                try
                {
                    sr.Address_Dir = (System.String)dt.Rows[i]["Address_Dir"];
                }
                catch
                {
                }

                try
                {
                    sr.District = (System.Int32)dt.Rows[i]["District"];
                }
                catch
                {
                }

                try
                {
                    sr.Heated_Sq_Ft = (System.Int32)dt.Rows[i]["Heated_Sq_Ft"];
                }
                catch
                {
                }

                try
                {
                    sr.Subdivision_Code = (System.String)dt.Rows[i]["Subdivision_Code"];
                }
                catch
                {
                }

                try
                {
                    sr.Subdivision = (System.String)dt.Rows[i]["Subdivision"];
                }
                catch
                {
                }

                try
                {
                    sr.LandUse = (System.String)dt.Rows[i]["LandUse"];
                }
                catch
                {
                }

                aps.Add(sr);

            }

            CAMVIEW_Sales_list = (CAMVIEW_Sales[])aps.ToArray(typeof(CAMVIEW_Sales));

        }
        public void AddSearchResult(CAMVIEW_Sales psr)
        {
            aps.Add(psr);
            CAMVIEW_Sales_list = (CAMVIEW_Sales[])aps.ToArray(typeof(CAMVIEW_Sales));
        }
        
        
        
        public CAMVIEW_SalesList()
        {
        }
    }

    public class CAMVIEW_Sales
    {
        public System.String PRPROP { get; set; }
        public System.String PIN { get; set; }
        public System.String Sale_Date { get; set; }
        public System.Decimal Sale_Price { get; set; }
        public System.String Sale_Qual { get; set; }
        public System.Int32 Book { get; set; }
        public System.Int32 Page { get; set; }
        public System.String Instrument { get; set; }
        public System.String Vacant_Impr { get; set; }
        public System.Decimal acres { get; set; }
        public System.Int32 Year_Built { get; set; }
        public System.String Address_Street { get; set; }
        public System.String Address_House { get; set; }
        public System.String Address_Type { get; set; }
        public System.String Address_Dir { get; set; }
        public System.Int32 District { get; set; }
        public System.Int32 Heated_Sq_Ft { get; set; }
        public System.String Subdivision_Code { get; set; }
        public System.String Subdivision { get; set; }
        public System.String LandUse { get; set; }
        public CAMVIEW_Sales()
        {

        }



    }




}
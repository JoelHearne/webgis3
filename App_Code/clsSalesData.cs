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


    /// <summary>
    /// Summary description for clsSalesData
    /// </summary>
    public class clsSalesData
    {
        public int start_rec = 1;
        public int end_rec = 1;
        public int rec_count = 0;
        public String search_type = "";
        public String sqlWhere = "";

        //public CAMVIEW_Sales[] CAMVIEW_Sales_list;
        public PropertySearchList proplist=new PropertySearchList();
        private ArrayList aps = new ArrayList();

        private String conStr = "Server=gisvm104\\GRIZZLY;Database=Central_GIS;User Id=PA_User;Password=pa2gisuser;";
        private String srcView = "CAMVIEW_Sales";
 
        public clsSalesData()
        {

        }


        public void ExecutePagedSearch(SalesQuery qryObj,int startrec,int endrec)
        {
            start_rec = startrec;
            end_rec = endrec;
            sqlWhere = buildWhereStr(qryObj);

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

            //String sqlStr = "";
            //sqlStr = sqlStr + "select * from CAMVIEW_Sales ";
            //sqlStr = sqlStr +  buildWhereStr(qryObj);
            /*
            String sqlStr = "SELECT * FROM CAMVIEW_PropertyCardSales WHERE pin in (";
            sqlStr = sqlStr + "select pin from CAMVIEW_Sales ";
            sqlStr = sqlStr + buildWhereStr(qryObj);
            sqlStr = sqlStr + ")";
            */
            String msqlStr = "SELECT * FROM CAMVIEW_PropertyCardSalesWebGIS WHERE pin in (";
            msqlStr = msqlStr + "select pin from CAMVIEW_Sales ";
            msqlStr = msqlStr + sqlWhere;
            msqlStr = msqlStr + ")";

            String sqlStr = "";
            sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
            sqlStr = sqlStr + "  (";
            sqlStr = sqlStr + msqlStr;
            sqlStr = sqlStr + "  ) a";
            sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
            sqlStr = sqlStr + "  WHERE   RowNum >= " + startrec.ToString() + " AND RowNum <= " + endrec.ToString();


            String csqlStr = "SELECT COUNT(*) FROM CAMVIEW_PropertyCardSalesWebGIS WHERE pin in (";
            csqlStr = csqlStr + "select pin from CAMVIEW_Sales ";
            csqlStr = csqlStr + sqlWhere;
            csqlStr = csqlStr + ")";


            SqlCommand ccmd = new SqlCommand(csqlStr, cn);

            try
            {
                rec_count = (int)ccmd.ExecuteScalar();
            }
            catch
            {
                rec_count = 0;
            }





            SqlCommand cmd = new SqlCommand(sqlStr, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);

            PrepResults(dt);

            cn.Close();

            proplist.rec_count = rec_count;
            proplist.search_type = "sales";
            proplist.sqlWhere = sqlWhere;
            proplist.start_rec = start_rec;
            proplist.end_rec = end_rec;
        }

        public void ExecuteSearch(SalesQuery qryObj)
        {
            sqlWhere = buildWhereStr(qryObj);

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

            //String sqlStr = "";
            //sqlStr = sqlStr + "select * from CAMVIEW_Sales ";
            //sqlStr = sqlStr +  buildWhereStr(qryObj);

            String sqlStr = "SELECT * FROM CAMVIEW_PropertyCardSales WHERE pin in (";
            sqlStr = sqlStr + "select pin from CAMVIEW_Sales ";
            sqlStr = sqlStr + sqlWhere;
            sqlStr = sqlStr + ")";
            



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
                PropertySearchResult sr = new PropertySearchResult();
                 
                try
                {
                    sr.owner = (System.String)dt.Rows[i]["owner_name"];
                }
                catch
                {
                }
                 

                try
                {
                    sr.pin = (System.String)dt.Rows[i]["PIN"];
                }
                catch
                {
                }

                try
                {
                    sr.hstead = (System.String)dt.Rows[i]["homestead"];
                }
                catch
                {
                }

                try
                {
                    sr.addr = (System.String)dt.Rows[i]["address"];
                }
                catch
                {
                }
                proplist.AddSearchResult(sr);
                //aps.Add(sr);

            }

            //CAMVIEW_Sales_list = (CAMVIEW_Sales[])aps.ToArray(typeof(CAMVIEW_Sales));

        }
        private void PrepResultsfull(DataTable dt)
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

            //CAMVIEW_Sales_list = (CAMVIEW_Sales[])aps.ToArray(typeof(CAMVIEW_Sales));

        }
        public void AddSearchResult(CAMVIEW_Sales psr)
        {
            aps.Add(psr);
            //CAMVIEW_Sales_list = (CAMVIEW_Sales[])aps.ToArray(typeof(CAMVIEW_Sales));
        }


        private  String buildWhereStr(SalesQuery qo)
        {
            String whereStr = "";

            ArrayList al = new ArrayList();


            if (qo.startAcreage >= 0 && qo.endAcreage > 0)
            {
                al.Add((String.Format(" acres >={0} AND acres <={1}", qo.startAcreage , qo.endAcreage)));
            }

            if (qo.startArea >= 0 && qo.endArea > 0)
            {
                al.Add((String.Format(" Heated_Sq_Ft >={0} AND Heated_Sq_Ft <={1}", qo.startArea, qo.endArea)));
            }

            if (qo.startPrice >= 0 && qo.endPrice > 0)
            {
                al.Add((String.Format(" SalePrice >={0} AND SalePrice <={1}", qo.startPrice, qo.endPrice)));
            }

            if (qo.startDate !="" && qo.endDate !="")
            {
                al.Add((String.Format(" SaleDate >='{0}' AND SaleDate <='{1}'", qo.startDate, qo.endDate)));
            }

           /*
            if (qo.subNumber != "")
            {
                al.Add((String.Format(" Subdivision_Code  ='{0}' ", qo.subNumber)));
            }


            if (qo.subid != "")
            {
                al.Add((String.Format(" Subdivision ='{0}' ", qo.subid)));
            }
            */
            if (qo.sub != "" && qo.sub !=null)
            {
                al.Add((String.Format(" Subdivision ='{0}' ", qo.sub)));
            }

            if (qo.sectionValue != "")
            {
                //al.Add((String.Format(" Subdivision ='{0}' ", qo.subid)));
            }

            if (qo.townshipValue != "")
            {
                //al.Add((String.Format(" Subdivision ='{0}' ", qo.subid)));
            }

            if (qo.rangeValue != "")
            {
                //al.Add((String.Format(" Subdivision ='{0}' ", qo.subid)));
            }



            if (qo.saleQualification1 != "")
            {
                //al.Add((String.Format(" Sale_Qual ='{0}' ", qo.saleQualification1)));
            }

            if (qo.saleQualification != "")
            {
                //al.Add((String.Format(" Sale_Qual ='{0}' ", qo.saleQualification)));
            }


            if (qo.saleVacant1 != "")
            {
                //al.Add((String.Format(" Vacant_Impr ='{0}' ", qo.saleVacant1)));
            }

            if (qo.saleVacant2 != "")
            {
                //al.Add((String.Format(" Vacant_Impr ='{0}' ", qo.saleVacant2)));
            }

            if (qo.saleVacant != "")
            {
                //al.Add((String.Format(" Vacant_Impr ='{0}' ", qo.saleVacant)));
            }
 
 
            String[] als = (String[])al.ToArray(typeof(String));
            whereStr = " WHERE " + String.Join(" AND ", als);

            return whereStr;
        }




    }


    public class SalesQuery
    {
        //public String subNumber { get; set; }
        //public String subid { get; set; }
        public String sub  { get; set; }
      
        public String sectionValue { get; set; }
        public String townshipValue { get; set; }
        public String rangeValue { get; set; }
        public String startDate { get; set; }
        public String endDate { get; set; }
        public double startPrice { get; set; }
        public double endPrice { get; set; }
        public double startArea { get; set; }
        public double endArea { get; set; }
        public double startAcreage { get; set; }
        public double endAcreage { get; set; }
        public String saleQualification1 { get; set; }
        public String saleQualification { get; set; }
        public String saleVacant1 { get; set; }
        public String saleVacant2 { get; set; }
        public String saleVacant { get; set; }

        public SalesQuery()
        {

        }



    }

}
using System;
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
 


namespace WebGIS
{


    /// <summary>
    /// Summary description for WebGIS
    /// </summary>
    [WebService(Namespace = "http://webgis.co.okaloosa.fl.us/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    [ScriptService]
    public class WebGIS : System.Web.Services.WebService
    {

        public WebGIS()
        {

            //Uncomment the following line if using designed components 
            //InitializeComponent(); 
        }



        [WebMethod(Description = "Query property records by searchtype: pin, pin_list, address, sub,bus,leg, or owner.")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String PropertyQuery(String searchtype, String searchString)
        {
            PropertySearchList pl = new PropertySearchList();

            if (searchtype == "pin")
            {
                pl.ExecuteSearch(searchString, searchtype);
            }
            else if (searchtype == "pin_list")
            {
                pl.ExecuteSearch(searchString, searchtype);
            }
            else if (searchtype == "address")
            {
                pl.ExecuteSearch(searchString, searchtype);
            }
            else if (searchtype == "owner")
            {
                pl.ExecuteSearch(searchString, searchtype);
            }
            else if (searchtype == "sub")
            {
                pl.ExecuteSearch(searchString, searchtype);
            }
            else if (searchtype == "bus")
            {
                pl.ExecuteSearch(searchString, searchtype);
            }
            else if (searchtype == "leg")
            {
                pl.ExecuteSearch(searchString, searchtype);
            }


            JavaScriptSerializer serializer = new JavaScriptSerializer();
            String res = serializer.Serialize(pl.ps_res);
            return res;
            //return pr;
        }

        [WebMethod(Description = "Query property records by searchtype: pin, pin_list, address, sub,bus,leg, or owner.")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void PropertyQueryPaged(String searchtype, String searchString,int startrec,int endrec)
        {
            PropertySearchList2 pl = new PropertySearchList2();

            if (searchtype == "pin")
            {
                pl.ExecuteSearch(searchString, searchtype,startrec,endrec);
            }
            else if (searchtype == "pin_list")
            {
                pl.ExecuteSearch(searchString, searchtype, startrec, endrec);
            }
            else if (searchtype == "address")
            {
                pl.ExecuteSearch(searchString, searchtype, startrec, endrec);
            }
            else if (searchtype == "owner")
            {
                pl.ExecuteSearch(searchString, searchtype, startrec, endrec);
            }
            else if (searchtype == "sub")
            {
                pl.ExecuteSearch(searchString, searchtype, startrec, endrec);
            }
            else if (searchtype == "bus")
            {
                pl.ExecuteSearch(searchString, searchtype, startrec, endrec);
            }
            else if (searchtype == "leg")
            {
                pl.ExecuteSearch(searchString, searchtype, startrec, endrec);
            }

             

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            String res = serializer.Serialize(pl);  // multiple or zero results

            // return minimal parcel detail if there is only one result PropertySearchResult

            /*
            if (pl.ps_res.Length == 1)
            {
                PropertysearchMinDetail pmd = new PropertysearchMinDetail(pl.ps_res[0]);
                res = serializer.Serialize(pmd);  // multiple or zero results

            }
            */



            //return res;
            System.Web.HttpContext.Current.Response.Write(res);
             
        }


        [WebMethod(Description = "Query property record to populate minimal detail card")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void PropertyQueryMinDet(String pin)
        {
            PropertySearchList2 pl = new PropertySearchList2();

          
             pl.ExecuteSearch(pin, "pin",1,1);
            

             

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            String res = serializer.Serialize(pl);  // multiple or zero results

            // return minimal parcel detail if there is only one result PropertySearchResult
 
            if (pl.ps_res.Length == 1)
            {
                PropertysearchMinDetail pmd = new PropertysearchMinDetail(pl.ps_res[0]);
                res = serializer.Serialize(pmd);  // multiple or zero results

            }
   

            //return res;
            System.Web.HttpContext.Current.Response.Write(res);
             
        }
        
        
        
        [WebMethod(Description = "Query sales list for date range")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SalesListQuery(String year, String month)
        {
            SalesSearchResultList sl = new SalesSearchResultList();

            sl.ExecuteSearchByYearMonth(year, month);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            String res = serializer.Serialize(sl.salessearch_list);
            //return res;
            System.Web.HttpContext.Current.Response.Write(res);
           
        }


        [WebMethod(Description = "Query sales list using detailed search")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SalesListQuery_Detailed(String objjson)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            Object soo =  (Object)serializer.DeserializeObject(objjson);
            Type ttpe = soo.GetType();

            var so =  serializer.Deserialize<CAMVIEW_Sales>(objjson);
 
            CAMVIEW_SalesList sl = new CAMVIEW_SalesList();
            sl.ExecuteSearch(so);

           
            String res = serializer.Serialize(sl.CAMVIEW_Sales_list);
       

            //return res;
            System.Web.HttpContext.Current.Response.Write(res);
        }


        [WebMethod(Description = "Query sales data using detailed search")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SalesDataQuery(String objjson)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
             var so = serializer.Deserialize<SalesQuery>(objjson);

             clsSalesData sl = new clsSalesData();
             sl.ExecuteSearch(so);
             String res = serializer.Serialize(sl.proplist.ps_res);
 
             //return res;
            //return pr;
            System.Web.HttpContext.Current.Response.Write(res);
        }

        [WebMethod(Description = "Query sales data using detailed search")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SalesDataQueryPaged(int startrec,int endrec,String objjson)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var so = serializer.Deserialize<SalesQuery>(objjson);

            clsSalesData sl = new clsSalesData();
            sl.ExecutePagedSearch(so,startrec,endrec);
            sl.proplist.search_type = "sales";
            String res = serializer.Serialize(sl.proplist);

            //return res;
            System.Web.HttpContext.Current.Response.Write(res);
        }



    }


    public class PropertysearchMinDetail
    {
        public String pin = "";
        public String owner = "";
        public String PEFLADDR1 = "";
        public String PEFLADDR2 = "";
        public String PEFLADDR3 = "";
        public String PEFLCITY = "";
        public String PEFLST = "";
        public String PEFLZIP5 = "";
        public String PEFLCNTRY = "";
        public String PEFLCONF = "";
        public double taxable_value = 0;
        public double exempt_value = 0;
        public double ag_value = 0;
        public double land_value = 0;
        public double bldg_value = 0;
        public double xtra_value = 0;
        public double just_value = 0;
        public double assd_value = 0;
        public String HMSTD = "";
        public String COMMISSION = "";
        public String commissioner = "";
        public String ZONING = "";
        public String FLUPY = "";
        public String TRACT = "";
        public String WETLAND = "";
        public String FLDWY = "";
        public String FLDZ_BFE = "";
        public String WATER = "";
        public String POWER = "";
        public String SUBDIVISION = "";
        public String FIRE = "";
        public String COBRA = "";
        public double acres = 0;
        public String propertyuse = "";
        public String landuse = "";
        public String lu_code = "";

        public String owner_addr = "";

        public Sale[] sales_list;


        private String conStr = "Server=xxxxx;Database=xxxxx;User Id=xxxxx;Password=xxxxx;";

        public PropertysearchMinDetail() { }
        public PropertysearchMinDetail(PropertySearchResult pr) 
        {
            pin = pr.pin;
            owner=pr.owner;
            owner_addr = pr.addr;
            ExecuteSearch();
            getsales();
 
        }

        public void getsales()
        {
            Sales sls = new Sales(pin);
            sales_list = sls.sales_list;


        }
        public void ExecuteSearch()
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
            sqlStr = sqlStr + " SELECT pin,PRPROP,owner,PEFLADDR1,PEFLADDR2,PEFLADDR3,PEFLCITY,PEFLST,PEFLZIP5,PEFLCNTRY,PEFLCONF,";
            sqlStr = sqlStr + "  taxable_value,exempt_value,ag_value,land_value,bldg_value,xtra_value,just_value,assd_value,HMSTD,";
            sqlStr = sqlStr + "  COMMISSION,commissioner,ZONING,FLUPY,TRACT,WETLAND,FLDWY,FLDZ_BFE,WATER,POWER,SUBDIVISION,FIRE,COBRA,";
            sqlStr = sqlStr + "  acres,propertyuse,landuse,lu_code   ";
            sqlStr = sqlStr + "  FROM xxxxx.dbo.CAMVIEW_MinParcelDetail ";
            sqlStr = sqlStr + "  WHERE pin='" + pin.Trim() + "'";

           

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
                try
                {
                    pin = (String)dt.Rows[i]["pin"];
                }
                catch
                {
                }
                try
                {
                    owner = (String)dt.Rows[i]["owner"];
                }
                catch
                {
                }
                try
                {
                    PEFLADDR1 = (String)dt.Rows[i]["PEFLADDR1"];
                }
                catch
                {
                }
                try
                {
                    PEFLADDR2 = (String)dt.Rows[i]["PEFLADDR2"];
                }
                catch
                {
                }
                try
                {
                    PEFLADDR3 = (String)dt.Rows[i]["PEFLADDR3"];
                }
                catch
                {
                }
                try
                {
                    PEFLCITY = (String)dt.Rows[i]["PEFLCITY"];
                }
                catch
                {
                }
                try
                {
                    PEFLST = (String)dt.Rows[i]["PEFLST"];
                }
                catch
                {
                }
                try
                {
                    PEFLZIP5 = (String)dt.Rows[i]["PEFLZIP5"];
                }
                catch
                {
                }
                try
                {
                    PEFLCNTRY = (String)dt.Rows[i]["PEFLCNTRY"];
                }
                catch
                {
                }
                try
                {
                    PEFLCONF = (String)dt.Rows[i]["PEFLCONF"];
                }
                catch
                {
                }
                try
                {
                    taxable_value = (double)((Decimal)dt.Rows[i]["taxable_value"]);
                }
                catch
                {
                }
                try
                {
                    exempt_value = (double)((Decimal)dt.Rows[i]["exempt_value"]);
                }
                catch
                {
                }
                try
                {
                    ag_value = (double)((Decimal)dt.Rows[i]["ag_value"]);
                }
                catch
                {
                }
                try
                {
                    land_value = (double)((Decimal)dt.Rows[i]["land_value"]);
                }
                catch
                {
                }
                try
                {
                    bldg_value = (double)((Decimal)dt.Rows[i]["bldg_value"]);
                }
                catch
                {
                }
                try
                {
                    xtra_value = (double)((Decimal)dt.Rows[i]["xtra_value"]);
                }
                catch
                {
                }
                try
                {
                    just_value = (double)((Decimal)dt.Rows[i]["just_value"]);
                }
                catch
                {
                }
                try
                {
                    assd_value = (double)((Decimal)dt.Rows[i]["assd_value"]);
                }
                catch
                {
                }
                try
                {
                    HMSTD = (String)dt.Rows[i]["HMSTD"];
                }
                catch
                {
                }
                try
                {
                    COMMISSION = (String)dt.Rows[i]["COMMISSION"];
                }
                catch
                {
                }
                try
                {
                    commissioner = (String)dt.Rows[i]["commissioner"];
                }
                catch
                {
                }
                try
                {
                    ZONING = (String)dt.Rows[i]["ZONING"];
                }
                catch
                {
                }
                try
                {
                    FLUPY = (String)dt.Rows[i]["FLUPY"];
                }
                catch
                {
                }
                try
                {
                    TRACT = (String)dt.Rows[i]["TRACT"];
                }
                catch
                {
                }
                try
                {
                    WETLAND = (String)dt.Rows[i]["WETLAND"];
                }
                catch
                {
                }
                try
                {
                    FLDWY = (String)dt.Rows[i]["FLDWY"];
                }
                catch
                {
                }
                try
                {
                    FLDZ_BFE = (String)dt.Rows[i]["FLDZ_BFE"];
                }
                catch
                {
                }
                try
                {
                    WATER = (String)dt.Rows[i]["WATER"];
                }
                catch
                {
                }
                try
                {
                    POWER = (String)dt.Rows[i]["POWER"];
                }
                catch
                {
                }
                try
                {
                    SUBDIVISION = (String)dt.Rows[i]["SUBDIVISION"];
                }
                catch
                {
                }
                try
                {
                    FIRE = (String)dt.Rows[i]["FIRE"];
                }
                catch
                {
                }
                try
                {
                    COBRA = (String)dt.Rows[i]["COBRA"];
                }
                catch
                {
                }
                try
                {
                    acres = (double)dt.Rows[i]["acres"];
                }
                catch
                {
                }
                try
                {
                    propertyuse = (String)dt.Rows[i]["propertyuse"];
                }
                catch
                {
                }
                try
                {
                    landuse = (String)dt.Rows[i]["landuse"];
                }
                catch
                {
                }
                try
                {
                    lu_code = (String)dt.Rows[i]["lu_code"];
                }
                catch
                {
                }
 
            }
 
        }

    }




    public class PropertySearchList2
    {
        public int start_rec = 1;
        public int end_rec = 1;
        public int rec_count = 0;
        public String search_type = "";
        public String sqlWhere = "";


        public PropertySearchResult[] ps_res;
        String conStr = "Server=xxxxx;Database=xxxxx;User Id=xxxxx;Password=xxxxx;";
        private ArrayList aps = new ArrayList();

 
        public PropertySearchList2() { }

        public void ExecuteSearch(String sqlWhereVal, String searchtype, int rowstart, int rowend)
        {
            search_type = searchtype;
            sqlWhere = sqlWhereVal;
            start_rec = rowstart;
            end_rec = rowend;
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
            sqlStr = sqlStr + "SELECT PRPROP,PIN,owner,PRUSE,PACONF,Site_Address,Owner_Address,LEDESC,Last_Sale,HMSTD ";
            sqlStr = sqlStr + "FROM CAMVIEW_PropertyList";

            String osqlStr = sqlStr;
            String csqlStr = "SELECT COUNT(pin) FROM CAMVIEW_PropertyList ";
            //sqlStr = sqlStr + "where c.pin='13-2S-24-0150-0003-0070'";
            //sqlStr = sqlStr + "and l.lerecn=1";

            //String sqlstr = bsqlstr + " WHERE pin like '" + sqlWhereVal + "%'";


            if (searchtype == "pin")
            {
                sqlStr = "";
                sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
                sqlStr = sqlStr + "  (";
                sqlStr = sqlStr + osqlStr;
                sqlStr = sqlStr + " WHERE pin like '" + sqlWhereVal + "%'";
                sqlStr = sqlStr + "  ) a";
                sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
                sqlStr = sqlStr + "  WHERE   RowNum >= " + rowstart.ToString() + " AND RowNum <= " + rowend.ToString();

             
                csqlStr = csqlStr + " WHERE pin like '" + sqlWhereVal + "%'";
                
            }
            else if (searchtype == "pin_list")
            {
                String[] pins = sqlWhereVal.Split(',');


                for (int i = 0; i < pins.Length; i++)
                {
                    pins[i] = "'" + pins[i] + "'";
                }

                String newWhere = String.Join(",", pins);
                newWhere = "(" + newWhere + ")";


                sqlStr = "";
                sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
                sqlStr = sqlStr + "  (";
                sqlStr = sqlStr + osqlStr;
                sqlStr = sqlStr + " WHERE pin in " + newWhere;
                sqlStr = sqlStr + "  ) a";
                sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
                sqlStr = sqlStr + "  WHERE   RowNum >= " + rowstart.ToString() + " AND RowNum <= " + rowend.ToString();

                csqlStr = csqlStr + " WHERE pin in " + newWhere;

            }
            else if (searchtype == "address")
            {
                sqlStr = "";
                sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
                sqlStr = sqlStr + "  (";
                sqlStr = sqlStr + osqlStr;
                sqlStr = sqlStr + " WHERE Site_Address like '%" + sqlWhereVal + "%'";
                sqlStr = sqlStr + "  ) a";
                sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
                sqlStr = sqlStr + "  WHERE   RowNum >= " + rowstart.ToString() + " AND RowNum <= " + rowend.ToString();

                csqlStr = csqlStr + " WHERE Site_Address like '%" + sqlWhereVal + "%'";

            }
            else if (searchtype == "owner")
            {

                sqlStr = "";
                sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
                sqlStr = sqlStr + "  (";
                sqlStr = sqlStr + osqlStr;
                sqlStr = sqlStr + " WHERE owner like '%" + sqlWhereVal + "%'";
                sqlStr = sqlStr + "  ) a";
                sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
                sqlStr = sqlStr + "  WHERE   RowNum >= " + rowstart.ToString() + " AND RowNum <= " + rowend.ToString();

                csqlStr = csqlStr + " WHERE owner like '" + sqlWhereVal + "%'";
            }
            else if (searchtype == "sub")
            {
                sqlStr = "";
                /*sqlStr = sqlStr + " SELECT  PRPROP,PIN,owner,PRUSE,PACONF,Site_Address,Owner_Address,LEDESC,Last_Sale,HMSTD FROM CAMVIEW_PropertyList FROM CAMVIEW_PropertyList  p";
                sqlStr = sqlStr + "  JOIN  PA_CAMPA c ON p.PRPROP=c.PAPROP";
                sqlStr = sqlStr + "  JOIN  PA_CAMSUBD  s  ON c.PASUBD=s.SUBDCD";
                sqlStr = sqlStr + "  WHERE SUBDDS LIKE '%" + sqlWhereVal + "%'";
                */

                sqlStr = "";
                sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
                sqlStr = sqlStr + "  (";
                sqlStr = sqlStr + " SELECT  PRPROP,PIN,owner,PRUSE,p.PACONF,Site_Address,Owner_Address,LEDESC,Last_Sale,HMSTD FROM CAMVIEW_PropertyList  p";
                sqlStr = sqlStr + "  JOIN  PA_CAMPA c ON p.PRPROP=c.PAPROP";
                sqlStr = sqlStr + "  JOIN  PA_CAMSUBD  s  ON c.PASUBD=s.SUBDCD";
                sqlStr = sqlStr + "  WHERE SUBDDS LIKE '%" + sqlWhereVal + "%'";
                sqlStr = sqlStr + "  ) a";
                sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
                sqlStr = sqlStr + "  WHERE   RowNum >= " + rowstart.ToString() + " AND RowNum <= " + rowend.ToString();
                csqlStr = "";
                csqlStr = csqlStr + " SELECT  Count(pin) FROM CAMVIEW_PropertyList  p";
                csqlStr = csqlStr + "  JOIN  PA_CAMPA c ON p.PRPROP=c.PAPROP";
                csqlStr = csqlStr + "  JOIN  PA_CAMSUBD  s  ON c.PASUBD=s.SUBDCD";
                csqlStr = csqlStr + "  WHERE SUBDDS LIKE '%" + sqlWhereVal + "%'";
            }
            else if (searchtype == "bus")
            {
                sqlStr = "";
                sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
                sqlStr = sqlStr + "  (";
                sqlStr = sqlStr + "  SELECT   PRPROP,PIN,owner,PRUSE,PACONF,Site_Address,Owner_Address,LEDESC,Last_Sale,HMSTD  FROM  CAMVIEW_PropertyList  p";
                sqlStr = sqlStr + "  JOIN PA_WBusName b ON p.PRPROP=b.OWFLPROP";
                sqlStr = sqlStr + "  WHERE OWFLNAME LIKE '%" + sqlWhereVal + "%'";
                sqlStr = sqlStr + "  ) a";
                sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
                sqlStr = sqlStr + "  WHERE   RowNum >= " + rowstart.ToString() + " AND RowNum <= " + rowend.ToString() ;
                csqlStr = "";
                csqlStr = csqlStr + "  SELECT   COUNT(PIN)  FROM  CAMVIEW_PropertyList  p";
                csqlStr = csqlStr + "  JOIN PA_WBusName b ON p.PRPROP=b.OWFLPROP";
                csqlStr = csqlStr + "  WHERE OWFLNAME LIKE '%" + sqlWhereVal + "%'";

            }

            //sqlStr = sqlStr + " and l.lerecn=1";

            if (searchtype == "leg")
            {
                sqlStr = "";
                sqlStr = sqlStr + "  SELECT   * FROM    ( SELECT ROW_NUMBER() OVER ( ORDER BY PIN ) AS RowNum, * FROM  ";
                sqlStr = sqlStr + "  (";
                sqlStr = sqlStr + osqlStr;
                sqlStr = sqlStr + " WHERE  ledesc like '%" + sqlWhereVal + "%'";
                sqlStr = sqlStr + "  ) a";
                sqlStr = sqlStr + "  ) AS RowConstrainedResult  ";
                sqlStr = sqlStr + "  WHERE   RowNum >= " + rowstart.ToString() + " AND RowNum <= " + rowend.ToString();


                csqlStr = csqlStr + " WHERE  ledesc like '%" + sqlWhereVal + "%'";
            }


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

        }

        private void PrepResults(DataTable dt)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                String isHomeStead = (String)dt.Rows[i]["HMSTD"];
               
                //PRPROP,PIN,owner,PRUSE,PACONF,Site_Address,Owner_Address,LEDESC,Last_Sale,HMSTD

                String owner = (String)dt.Rows[i]["owner"];
                String pin = (String)dt.Rows[i]["pin"];
                String ownadd  = (String)dt.Rows[i]["Owner_Address"];
                 
         
                String sardate = "";
                try
                {
                    sardate = (String)dt.Rows[i]["Last_Sale"];
               
                }
                catch
                {

                }


                String legl = (String)dt.Rows[i]["LEDESC"];
 
                PropertySearchResult pr = new PropertySearchResult(pin, owner, ownadd, isHomeStead);
                pr.lastSale = sardate;
                pr.legal = legl;
                aps.Add(pr);

            }

            ps_res = (PropertySearchResult[])aps.ToArray(typeof(PropertySearchResult));

        }

        public void AddSearchResult(PropertySearchResult psr)
        {
            aps.Add(psr);
            ps_res = (PropertySearchResult[])aps.ToArray(typeof(PropertySearchResult));


        }

    }


    public class PropertySearchList
    {

        public PropertySearchResult[] ps_res;
        public int rec_count = 0;
        public String search_type = "";
        public String sqlWhere = "";

        public int start_rec = 1;
        public int end_rec = 50;
   
 
        private String conStr = "Server=xxxxx;Database=WebGIS;User Id=webgisuser;Password=web1gis;";
        private ArrayList aps = new ArrayList();
        private String bsqlstr = "SELECT peflex1cd,peflname,pin,pefladdr1,pefladdr2,pefladdr3,peflacity,peflst,peflzip5,peflcntry,passnam,sardate FROM cama_search_view ";

        public PropertySearchList() { }

   
        public void ExecuteSearch(String sqlWhereVal, String searchtype)
        {

            search_type = searchtype;
            sqlWhere = sqlWhereVal;

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
            sqlStr = sqlStr + "SELECT distinct peflex1cd,peflname,c.pin,pefladdr1,";
            sqlStr = sqlStr + "pefladdr2,pefladdr3,peflacity,peflst,peflzip5,";
            sqlStr = sqlStr + "peflcntry,passnam,sardate,ledesc  ";
            sqlStr = sqlStr + " FROM dbo.cama_search_view  c ";
            sqlStr = sqlStr + " JOIN dbo.wlegl l ";
            sqlStr = sqlStr + " on c.pin=l.pin";
            //sqlStr = sqlStr + "where c.pin='13-2S-24-0150-0003-0070'";
            //sqlStr = sqlStr + "and l.lerecn=1";

            //String sqlstr = bsqlstr + " WHERE pin like '" + sqlWhereVal + "%'";


            if (searchtype == "pin")
            {
                sqlStr = sqlStr + " WHERE c.pin like '" + sqlWhereVal + "%'";
            }
            else if (searchtype == "pin_list")
            {
                String[] pins = sqlWhereVal.Split(',');
                

                for (int i = 0; i < pins.Length; i++)
                {
                    pins[i] = "'" + pins[i] + "'";
                }

                String newWhere = String.Join(",",pins);
                newWhere = "(" + newWhere + ")";
                sqlStr = sqlStr + " WHERE c.pin in " + newWhere;

            }
            else if (searchtype == "address")
            {

                /*String sqlStr = "SELECT  a.pin,peflname,pashouse,passdir,passnam,str_type,peflex1cd,sardate,owflname,appr_date, ";
                sqlStr = sqlStr + "pruse,usecds,pefladdr1,pefladdr2,pefladdr3,peflacity,peflst,peflzip5,peflcntry, ";
                sqlStr = sqlStr + "b.address FROM [WEBGIS].[dbo].[cama_search_view] a join [WEBGIS].[dbo].[siteaddress] b ";
                sqlStr = sqlStr + "  on a.pin=b.pin ";
                sqlStr = sqlStr + " WHERE address like '%" + sqlWhereVal + "%'";
                sqlstr = sqlStr;
                 */
                sqlStr = "";
                sqlStr = sqlStr + "SELECT distinct peflex1cd,peflname,c.pin,pefladdr1,";
                sqlStr = sqlStr + "pefladdr2,pefladdr3,peflacity,peflst,peflzip5,";
                sqlStr = sqlStr + "peflcntry,passnam,sardate,ledesc, a.ADDRESS  ";
                sqlStr = sqlStr + " FROM dbo.cama_search_view  c ";
                sqlStr = sqlStr + " JOIN dbo.wlegl l ";
                sqlStr = sqlStr + " on c.pin=l.pin";
                sqlStr = sqlStr + " JOIN dbo.siteaddress a";
                sqlStr = sqlStr + " on c.pin=a.PIN";
                sqlStr = sqlStr + " WHERE a.address like '%" + sqlWhereVal + "%'";

            }
            else if (searchtype == "owner")
            {
                sqlStr = sqlStr + " WHERE peflname like '" + sqlWhereVal + "%'";
            }
            else if (searchtype == "sub")
            {
                sqlStr = "";
                sqlStr = sqlStr + " SELECT distinct peflex1cd,peflname,c.pin,pefladdr1, pefladdr2,pefladdr3,peflacity,peflst,peflzip5,";
                sqlStr = sqlStr + "	peflcntry,passnam,sardate,ledesc, a.paoname  ";
                sqlStr = sqlStr + "	FROM dbo.cama_search_view  c ";
                sqlStr = sqlStr + "	JOIN dbo.wlegl l ";
                sqlStr = sqlStr + "	on c.pin=l.pin";
                sqlStr = sqlStr + "	JOIN dbo.wsubd a";
                sqlStr = sqlStr + "	on c.pin=a.PIN";
                sqlStr = sqlStr + " WHERE  a.paoname like '%" + sqlWhereVal + "%'";

            }
            else if (searchtype == "bus")
            {
                sqlStr = "";
                sqlStr = sqlStr + " SELECT distinct peflex1cd,peflname,c.pin,pefladdr1,pefladdr2,pefladdr3,peflacity,peflst,peflzip5,";
                sqlStr = sqlStr + "            peflcntry,passnam,sardate,ledesc, a.owflname  ";
                sqlStr = sqlStr + "             FROM dbo.cama_search_view  c ";
                sqlStr = sqlStr + "             JOIN dbo.wlegl l ";
                sqlStr = sqlStr + "             on c.pin=l.pin";
                sqlStr = sqlStr + "             JOIN dbo.wbusname a";
                sqlStr = sqlStr + "             on c.pin=a.PIN";
                sqlStr = sqlStr + " WHERE  a.owflname like '%" + sqlWhereVal + "%'";

            }

            sqlStr = sqlStr + " and l.lerecn=1";

            if (searchtype == "leg")
            {
                sqlStr = "";
                sqlStr = sqlStr + " SELECT distinct peflex1cd,peflname,c.pin,pefladdr1,pefladdr2,pefladdr3,peflacity,peflst,peflzip5,";
                sqlStr = sqlStr + "            peflcntry,passnam,sardate,ledesc, a.owflname  ";
                sqlStr = sqlStr + "             FROM dbo.cama_search_view  c ";
                sqlStr = sqlStr + "             JOIN dbo.wlegl l ";
                sqlStr = sqlStr + "             on c.pin=l.pin";
                sqlStr = sqlStr + "             JOIN dbo.wbusname a";
                sqlStr = sqlStr + "             on c.pin=a.PIN";
                sqlStr = sqlStr + " WHERE  ledesc like '%" + sqlWhereVal + "%'";

            }



            SqlCommand cmd = new SqlCommand(sqlStr, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);

            rec_count = dt.Rows.Count;

            PrepResults(dt);

            cn.Close();

        }

        private void PrepResults(DataTable dt)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                String hsc = (String)dt.Rows[i]["peflex1cd"];
                String isHomeStead = "no";
                if (hsc.Contains("HX")) isHomeStead = "yes";


                String owner = (String)dt.Rows[i]["peflname"];
                String pin = (String)dt.Rows[i]["pin"];
                String pefladdr1 = (String)dt.Rows[i]["pefladdr1"];
                String pefladdr2 = (String)dt.Rows[i]["pefladdr2"];
                String pefladdr3 = (String)dt.Rows[i]["pefladdr3"];
                String peflacity = (String)dt.Rows[i]["peflacity"];
                String peflst = (String)dt.Rows[i]["peflst"];
                String peflzip5 = (String)dt.Rows[i]["peflzip5"];

                int isardate = 0;
                String sardate = "";
                try
                {
                    isardate = (int)dt.Rows[i]["sardate"];
                    sardate = isardate.ToString();
                }
                catch
                {

                }


                String legl = (String)dt.Rows[i]["ledesc"];

                String ownadd = pefladdr1.Trim() + (pefladdr2.Trim() == "" ? " " + pefladdr2.Trim() : "");
                ownadd = ownadd + (pefladdr3.Trim() == "" ? " " + pefladdr3.Trim() : "");
                ownadd = ownadd + (peflacity.Trim() == "" ? ", " + peflacity.Trim() : "");
                ownadd = ownadd + (peflst.Trim() == "" ? ", " + peflst.Trim() : "");
                ownadd = ownadd + (peflzip5.Trim() == "" ? ", " + peflzip5.Trim() : "");

                Console.WriteLine(owner + " --- " + ownadd);

                PropertySearchResult pr = new PropertySearchResult(pin, owner, ownadd, isHomeStead);
                pr.lastSale = sardate;
                pr.legal = legl;
                aps.Add(pr);

            }

            ps_res = (PropertySearchResult[])aps.ToArray(typeof(PropertySearchResult));

        }

        public void AddSearchResult(PropertySearchResult psr)
        {
            aps.Add(psr);
            ps_res = (PropertySearchResult[])aps.ToArray(typeof(PropertySearchResult));


        }

    }

    public class PropertySearchResult
    {

        public String pin;
        public String owner;
        public String addr;
        public String hstead;
        public String legal;
        public String lastSale;

        public PropertySearchResult() { }
        public PropertySearchResult(String rpin, String rowner, String raddr, String rhstead)
        {
            pin = rpin;
            owner = rowner;
            addr = raddr;
            hstead = rhstead;

        }
        public PropertySearchResult(String rpin, String rowner, String raddr, String rhstead, String legDesc)
        {
            pin = rpin;
            owner = rowner;
            addr = raddr;
            hstead = rhstead;
            legal = legDesc;
        }

        public PropertySearchResult(String rpin, String rowner, String raddr, String rhstead, String legDesc, String last_sale)
        {
            pin = rpin;
            owner = rowner;
            addr = raddr;
            hstead = rhstead;
            legal = legDesc;
            lastSale = last_sale;
        }


    }


    public class SalesSearchResultList
    {

        /*
        public int rec_count = 0;
        public String search_type = "";
        public String sqlWhere = "";

        public PropertySearchResult[] ps_res;
        */

        public SalesSearchResult[] salessearch_list;
        String conStr = "Server=xxxxx;Database=xxxxx;User Id=xxxxx;Password=xxxxx;";
        private ArrayList aps = new ArrayList();


        public SalesSearchResultList() { }


        public void ExecuteSearchByYearMonth(String year, String month)
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
            sqlStr = sqlStr + "SELECT   * FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY sardate ) AS RowNm, *  ";
            sqlStr = sqlStr + "FROM PA_SalesList_Query(2013,1 ) ) AS RowConstrainedResult";
            sqlStr = sqlStr + "WHERE   RowNm >= 1  AND RowNum < 100000 ORDER BY RowNm";

            sqlStr = "SELECT   * FROM dbo.PA_SalesList_Query(" + year + "," + month + " )";

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
                //String hsc = (String)dt.Rows[i]["peflex1cd"];
                //String isHomeStead = "no";
                //if (hsc.Contains("HX")) isHomeStead = "yes";
                SalesSearchResult sr = new SalesSearchResult();

                String PRPROP = (String)dt.Rows[i]["PRPROP"];
                String PIN = (String)dt.Rows[i]["PIN"];
                String SARDATE = (String)dt.Rows[i]["SARDATE"];
                String SAQU = (String)dt.Rows[i]["SAQU"];
                String SAVI = (String)dt.Rows[i]["SAVI"];
                String PASSNAM = (String)dt.Rows[i]["PASSNAM"];
                String PASHOUSE = (String)dt.Rows[i]["PASHOUSE"];
                String PASSTYP = (String)dt.Rows[i]["PASSTYP"];
                String PASSDIR = (String)dt.Rows[i]["PASSDIR"];
                String SASINS = (String)dt.Rows[i]["SASINS"];


                Decimal SAPRICE = (Decimal)dt.Rows[i]["SAPRICE"];
                Decimal SARBOOK = (Decimal)dt.Rows[i]["SARBOOK"];
                Decimal SARPAGE = (Decimal)dt.Rows[i]["SARPAGE"];

                object to = dt.Rows[i]["acres"];
                Type ttype = to.GetType();


                try
                {
                    sr.acres = (Decimal)dt.Rows[i]["acres"];
                }
                catch
                {

                }

                try
                {
                    sr.BLSFHT = (Decimal)dt.Rows[i]["BLSFHT"];
                }
                catch
                {

                }

                try
                {
                    sr.BLAYB = (int)dt.Rows[i]["BLAYB"];
                }
                catch
                {

                }

                int PEFLTXDIST = (int)dt.Rows[i]["PEFLTXDIST"];


                sr.PRPROP = PRPROP;
                sr.PIN = PIN;
                sr.SARDATE = SARDATE;
                sr.SAQU = SAQU;
                sr.SAVI = SAVI;
                sr.PASSNAM = PASSNAM;
                sr.PASHOUSE = PASHOUSE;
                sr.PASSTYP = PASSTYP;
                sr.PASSDIR = PASSDIR;
                sr.SASINS = SASINS;
                sr.SAPRICE = SAPRICE;
                sr.SARBOOK = SARBOOK;
                sr.SARPAGE = SARPAGE;

                sr.PEFLTXDIST = PEFLTXDIST;


                aps.Add(sr);

            }

            salessearch_list = (SalesSearchResult[])aps.ToArray(typeof(SalesSearchResult));

        }

        public void AddSearchResult(SalesSearchResult psr)
        {
            aps.Add(psr);
            salessearch_list = (SalesSearchResult[])aps.ToArray(typeof(SalesSearchResult));
        }


    }


    public class SalesSearchResult
    {

        /*
    Parcel Number
    Sec-Twn-Rng
    District
    Sale Date
    Sale Price
    Heated Sq Ft
    Acres
    Sale Qual
    Year Built
    Location Address
    Book
    Page
    Instrument
    Vacant/Impr
    */
        public String PRPROP = "";
        public String PIN = "";
        public String SARDATE = "";
        public String SAQU = "";
        public String SAVI = "";
        public String PASSNAM = "";
        public String PASHOUSE = "";
        public String PASSTYP = "";
        public String PASSDIR = "";
        public String SASINS = "";

        public Decimal SAPRICE = 0;
        public Decimal SARBOOK = 0;
        public Decimal SARPAGE = 0;
        public Decimal acres = 0;
        public Decimal BLSFHT = 0;

        public int BLAYB = 0;
        public int PEFLTXDIST = 0;

        public SalesSearchResult() { }



    }


    public class Sales
    {
        public Sale[] sales_list;
        public String pin = "";
        private ArrayList aslist = new ArrayList();

        private String conStr = "Server=xxxxx;Database=xxxxx;User Id=xxxxx;Password=xxxxx;";

        public Sales() { }

        public Sales(String pinstr)
        {
            pin = pinstr;
            ExecuteSearch();
        }
        public void ExecuteSearch()
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
            sqlStr = sqlStr + " SELECT * FROM CAMVIEW_Sales";
            sqlStr = sqlStr + "  WHERE pin='" + pin.Trim() + "'";


            SqlCommand cmd = new SqlCommand(sqlStr, cn);

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            DataSet dSet = new DataSet();
            da.Fill(dt);

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                Sale sl = new Sale();
                
                try
                {
                    //Type typ =  dt.Rows[i]["SaleDate"].GetType();
                    DateTime sldate = (DateTime)dt.Rows[i]["SaleDate"];
                    sl.sale_date = sldate.ToShortDateString();
                }
                catch (Exception ex)
                {

                }

                try
                {
                    Type typ = dt.Rows[i]["SalePrice"].GetType();
                    sl.sale_amount = (double)((Decimal)dt.Rows[i]["SalePrice"]);
                }
                catch
                {
                }

                try
                {
                    sl.qualified = (String)dt.Rows[i]["SaleQual"];
                }
                catch
                {
                }
                try
                {
                    sl.vacant = (String)dt.Rows[i]["Vacant_Impr"];
                }
                catch
                {
                }
                aslist.Add(sl);

            }
             

            cn.Close();

            sales_list=(Sale[])aslist.ToArray(typeof(Sale));
             

        }





    }


    public class Sale
    {
        public String sale_date = "";
        //public String book = "";
        //public String page = "";
        public double sale_amount = 0.0;
        //public String instrument = "";
        public String qualified = "";
        public String vacant = "";
        //public String seller = "";
        //public String buyer = "";

        public Sale() { }


    }







}
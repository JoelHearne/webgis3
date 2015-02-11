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
    /// Summary description for clsSqlHelper
    /// </summary>
    public static class clsSqlHelper
    {

        public static String buildWhereStr(Object qryObj)
        {
            String whereStr = "";

            ArrayList al = new ArrayList();
            PropertyInfo[] properties = qryObj.GetType().GetProperties();
            foreach (PropertyInfo pi in properties)
            {
                String pType = pi.PropertyType.Name;
                String pName = pi.Name.Replace("_"," ");

                object oval = pi.GetValue(qryObj, null);

                if (pType == "String")
                {
                    String sval = (String)oval;
                    if (sval != null && sval != "")
                    {
                        al.Add((String.Format("[{0}]='{1}'", pName, sval)));
                    }
                }
                else if (pType == "Int32")
                {
                    Int32 ival = (Int32)oval;
                    if (ival != 0)
                    {
                        al.Add((String.Format("[{0}]={1}", pName, ival)));
                    }
                }
                else if (pType == "Decimal")
                {
                    Decimal ival = (Decimal)oval;
                    if (ival != 0)
                    {
                        al.Add((String.Format("[{0}]={1}", pName, ival)));
                    }
                }
                else if (pType == "Double")
                {
                    Double ival = (Double)oval;
                    if (ival != 0)
                    {
                        al.Add((String.Format("[{0}]={1}", pName, ival)));
                    }
                }
            }

            String[] als = (String[])al.ToArray(typeof(String));
            whereStr = " WHERE " + String.Join(" AND ", als);

            return whereStr;
        }
    }

}
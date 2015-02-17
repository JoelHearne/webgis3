 	  <?php
          //ini_set('display_errors', 1);
          // ini_set('log_errors', 1);
          // ini_set('error_log', dirname(__FILE__) . '/error_log.txt');
           //error_reporting(E_ALL);

          include("config.php");
          //include("..\support.php");


          $refsrc ="na";
      if (isset($_GET['cl'])) {
	        $refsrc = $_GET['cl'];
      } else {
           $refsrc ="na";
      }

          $pin = $_GET['pin'];
          $prop_num="";
          $pin_geom="";
          $cam_fiscyear=2014;

      ?>
 <!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
   <head>
      <title>
         Okaloosa County WebGIS - Full Parcel Detail
      </title>

      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

      <link rel="stylesheet" href="dw_style.css" type="text/css" media="screen">
      <link rel="stylesheet" href="./print_style.css" type="text/css"  media="print" />




    <link rel="stylesheet" href="js/jquery-ui-1.10.4/themes/smoothness/jquery-ui.min.css">
    <script src="js/jquery-ui-1.10.4/js/jquery-1.10.2.min.js"></script>
    <script src="js/jquery-ui-1.10.4/js/jquery-ui-1.10.4.min.js" ></script>
   <!-- <script src="pdfcapdetector.js" ></script>
    <script src="plugindetec.js" ></script>-->
	<script type="text/javascript" src="./js/utils.js"></script>



   </head>
   <!--<body onload="get_sketch();">-->

   <body>
      <!--<center>
         <table class="table_class">
            <tr>

                  <img src="./images/fl_okaloosa_crop_50.jpg" />

            </tr>
         </table>
      </center>
      -->

      <center>

		 <?php


		    $pin_exists=0;

            $prop_use="";
	     $owner="";
		 $maddress="";
		 $maddress_2="";
		 $taxdist="";
		 $Laddress="";
		 $prop_use="";
		 $sec ="";
		 $hmstd="";
		 $prop_use_desc="";


            $today = date("F j, Y");
            $year = date("Y");

            $sql_campr = "SELECT *
                          FROM pa_campr
                          WHERE PRDISP = '".$pin."' ";

            $stmt = sqlsrv_query( $conn, $sql_campr);

            if( $stmt === false )
            {
               echo "Error in statement preparation/execution.\n";
               die( print_r( sqlsrv_errors(), true));
            }

            while($row = sqlsrv_fetch_array($stmt))
            {
               $prop_num = rtrim($row['PRPROP']);
               $prop_use = $row['PRUSE'];
               //$pin_geom="":
			   $pin_exists=1;
            }


/*
             $sql_campr = "SELECT ogr_geometry.STAsText() as WKT
                           FROM pclp
                           WHERE PIN = '".$pin."' ";

             $stmt = sqlsrv_query( $conn, $sql_campr);

             if( $stmt === false )
             {
                echo "Error in statement preparation/execution.\n";
                die( print_r( sqlsrv_errors(), true));
             }

             while($row = sqlsrv_fetch_array($stmt))
             {
                $pin_geom= $row['WKT'];
             }

*/


              $sql_camfy = "SELECT  YEAR([CENTRAL_GIS].[dbo].[CurrentFiscalYear] ()) as fy";
              $stmt = sqlsrv_query( $conn,  $sql_camfy);

               if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

               while($row = sqlsrv_fetch_array($stmt))
                {
                   $cam_fiscyear  = $row['fy'];
                }
              // $cam_fiscyear  =$cam_fiscyear -1;



            $sql_camusec = "SELECT *
                            FROM pa_camusec
                            WHERE USECCD = '".$prop_use."' ";

            $stmt = sqlsrv_query( $conn, $sql_camusec);

            if( $stmt === false )
            {
               echo "Error in statement preparation/execution.\n";
               die( print_r( sqlsrv_errors(), true));
            }

            while($row = sqlsrv_fetch_array($stmt))
            {
                $prop_use_desc = $row['USECDS'];
            }

            $sql_camule = "SELECT *
                           FROM pa_camle
                           WHERE LEPROP = '".$prop_num."' ";

            $legal_desc_hold = "";
            $stmt = sqlsrv_query( $conn, $sql_camule);

            if( $stmt === false )
            {
               echo "Error in statement preparation/execution.\n";
               die( print_r( sqlsrv_errors(), true));
            }

            while($row = sqlsrv_fetch_array($stmt))
            {
                $legal_desc = $row['LEDESC'];

                if (strlen($legal_desc_hold) <= 2)
                {
                   $legal_desc_hold = "";
                   $legal_desc_hold = $legal_desc;
                 } else {
                   $legal_desc_hold = $legal_desc_hold." ".$legal_desc;
                 }
             }

             $cflpe = "SELECT *
                       FROM pa_cflpe
                       WHERE PEFLPROP = '".$prop_num."' ";

             $stmt = sqlsrv_query( $conn, $cflpe);

             if( $stmt === false )
             {
                echo "Error in statement preparation/execution.\n";
                die( print_r( sqlsrv_errors(), true));
             }

             while($row = sqlsrv_fetch_array($stmt))
             {
                 $taxdist = $row['PEFLTXDIST'];
                 switch ($taxdist) {
                    case 1:
                       $taxdist = "County (District 1)";
                       break;
                    case 2:
                       $taxdist = "Cinco Bayou-Wright Fire (District 2)";
                       break;
                    case 3:
                       $taxdist = "Crestview City (District 3)";
                       break;
                    case 4:
                       $taxdist = "FORT WALTON BEACH (District 4)";
                       break;
                    case 5:
                       $taxdist = "Mary Esther City (District 5)";
                       break;
                    case 6:
                       $taxdist = "Niceville City (District 6)";
                       break;
                    case 7:
                       $taxdist = "Shalimar City - Wright Fire (District 7)";
                       break;
                    case 8:
                       $taxdist = "Valparaiso City (District 8)";
                       break;
                    case 9:
                       $taxdist = "Destin Fire (District 9)";
                       break;
                    case 10:
                       $taxdist = "Destin City - Destin Fire (District 10)";
                       break;
                    case 11:
                       $taxdist = "Destin City - Holiday Isle (DF) (District 11)";
                       break;
                    case 12:
                       $taxdist = "OCEAN CITY/WRIGHT FIRE (District 12)";
                       break;
                    case 13:
                       $taxdist = "Okaloosa Island Fire (District 13)";
                       break;
                    case 14:
                       $taxdist = "North Bay Fire (District 14)";
                       break;
                    case 15:
                       $taxdist = "East Niceville Fire (District 15)";
                       break;
                    case 16:
                       $taxdist = "Sylvania Hights Fire (District 16)";
                       break;
                    case 17:
                       $taxdist = "Laurel Hill City (District 17)";
                       break;
                    case 21:
                       $taxdist = "FLOROSA FIRE (SW)(District 21)";
                       break;
                 }
             }

/*
             $sql_camula = "SELECT *
                            FROM pa_camla
                            WHERE LAPROP = '".$prop_num."' ";
             $stmt = sqlsrv_query( $conn, $sql_camula);


             if( $stmt === false )
             {
                echo "Error in statement preparation/execution.\n";
                die( print_r( sqlsrv_errors(), true));
             }
             $prop_acres=0;
             while($row = sqlsrv_fetch_array($stmt))
             {
                 $prop_acres = $row['LAACRES'];
                 if ($prop_acres >= 0)
                 {
                    $prop_acres = 0;
                 }
             }
*/
             $prop_acres=0;


             $sql_campa = "SELECT   PALGL1,PALGL2,PALGL3,PAONAME,CASE PASHOUSE
								WHEN '' THEN ''
								ELSE RTRIM(LTRIM(PASHOUSE)) + ' '
							END +
							CASE PASHSFX
								WHEN '' THEN ''
								ELSE RTRIM(LTRIM(PASHSFX)) + ' '
							END +
							CASE PASSNAM
								WHEN '' THEN ''
								WHEN '.' THEN ''
								ELSE RTRIM(LTRIM(PASSNAM)) + ' '
							END +
							CASE PASSTYP
								WHEN '' THEN ''
								ELSE RTRIM(LTRIM(PASSTYP)) + ' '
							END  +
							CASE PASSDIR
								WHEN '' THEN ''
								ELSE RTRIM(LTRIM(PASSDIR)) + ' '
							END
							  +
							CASE PASAPT#
								WHEN '' THEN ''
								ELSE RTRIM(LTRIM(PASAPT#)) + ' '
							END
							 +
							CASE PASCITY
								WHEN '' THEN ''
								ELSE RTRIM(LTRIM(PASCITY)) + ' '
							END   as loc_address
                           FROM pa_campa
                           WHERE PAPROP = '".$prop_num."' ";

           /*
           $sql_campa="select o.PEFLNAME,o.PEFLCONF, PAN + CASE WHEN MSAGNAME <> '' THEN ' ' + MSAGNAME END +  CASE WHEN SAD IS NOT NULL THEN ' ' + SAD + ' ' + SAN   ELSE '' END+  CASE WHEN a.ZIP_CITY IS NOT NULL AND a.ZIP_CITY <> '' THEN ', ' + a.ZIP_CITY + ' ' + a.ZIP   ELSE '' END  as loc_address " ;
             $sql_campa.="  from   dbo.PA_WOWNER o JOIN CENTRAL_SITEADDRESS a ON o.PIN=a.PIN  ";
              $sql_campa.="  WHERE o.PIN= '".$pin."' ";
*/

 $sql_campa="select o.OWNER_NAME ,w.PEFLCONF , PAN +
 CASE WHEN MSAGNAME <> '' THEN ' ' + MSAGNAME END + CASE WHEN SAD IS NOT NULL THEN ' ' + SAD + ' ' + SAN ELSE '' END
 + CASE WHEN a.ZIP_CITY IS NOT NULL AND a.ZIP_CITY <> '' THEN ', ' + a.ZIP_CITY + ' ' + a.ZIP ELSE '' END as loc_address
 from PA_OLVIEW1 o
 LEFT OUTER JOIN CENTRAL_SITEADDRESS a
 ON o.PIN_DSP=a.PIN
 LEFT OUTER JOIN dbo.PA_WOWNER w
 ON w.PIN=o.PIN_DSP
WHERE o.PIN_DSP= '".$pin."' ";


             $stmt = sqlsrv_query( $conn, $sql_campa);

             if( $stmt === false )
             {
                echo "Error in statement preparation/execution.\n";
                die( print_r( sqlsrv_errors(), true));
             }
             while($row = sqlsrv_fetch_array($stmt))
             {
                 $conf = trim($row['PEFLCONF']);

                 if ($conf=="Y") {
                    $owner = "";
                    $Laddress = "";

                 } else {
                    //$owner = $row['PEFLNAME'];
                    $owner = $row['OWNER_NAME'];
                    $Laddress = $row['loc_address'];
                 }



             }

             $sec=substr($pin,0,8);




             $sql_camwo = "SELECT ADDRESS_1 as ownaddr, CITY_NAME + ', ' + ST + ' ' + SUBSTRING(ZIPCODE,1,5) + ' ' + CNTRY as ownaddr_2,
             CASE
                WHEN SUBSTRING(EXCODE,1,2)='HX' THEN 'Y'
             ELSE 'N'
                END AS HMSTD,CAST(TOTACRES as float) as TOTACRES
              FROM [CENTRAL_GIS].[dbo].[PA_OLVIEW1]
              WHERE PIN_DSP = '".$pin."' ";

               $stmt = sqlsrv_query( $conn, $sql_camwo);


                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

                $maddress_2="";
               while($row = sqlsrv_fetch_array($stmt))
                {
                   $hmstd= $row['HMSTD'];
                   $maddress = $row['ownaddr'];
                   $maddress_2 = $row['ownaddr_2'];
                   $prop_acres = $row['TOTACRES'];
                }





                $sql_cambusn = "SELECT   OWFLNAME
                              FROM PA_WBusName
                              WHERE OWFLPROP = '".$prop_num."' ";

               $stmt = sqlsrv_query( $conn,  $sql_cambusn);

                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

                $busness="";
                $buscnt=0;
               while($row = sqlsrv_fetch_array($stmt))
                {
                   if ($buscnt == 0) {
                      $busness = $busness.$row['OWFLNAME'];
                   } else {
                      $busness = $busness."<BR>&nbsp;".$row['OWFLNAME'];
                   }

                   $buscnt=$buscnt + 1;
                }


/*
               $sql_cambusn = "SELECT  TOT_MILLAGE   FROM [CENTRAL_GIS].[dbo].[PA_CFLROLL] WHERE O_PARCEL_NUMBER_ = '".$prop_num."' ";

               $stmt = sqlsrv_query( $conn,  $sql_cambusn);

                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

                $millage=0;
               while($row = sqlsrv_fetch_array($stmt))
                {
                   $millage = $row['TOT_MILLAGE'];

                }

                $millage=$millage * 1000;
*/

               $sql_cambusn = "SELECT   MILLAGE   FROM [CENTRAL_GIS].[dbo].[PA_MILLAGE] WHERE PIN = '".$pin."' ";

               $stmt = sqlsrv_query( $conn,  $sql_cambusn);

                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

                $millage=0;
               while($row = sqlsrv_fetch_array($stmt))
                {
                   $millage = $row['MILLAGE'];

                }





                $millage=number_format((float)$millage, 4, '.', '');


          // value information
                $bld_value_current=0;
                $exfeat_value_current=0;
                $land_value_current=0;
                $landag_value_current=0;
                $ag_market_value_current=0;
                $just_marketvalue_current=0;
                $ass_value_current=0;
                $exmpt_value_current=0;
                $taxable_value_current=0;

                $bld_value_last=0;
                $exfeat_value_last=0;
                $land_value_last=0;
                $landag_value_last=0;
                $ag_market_value_last=0;
                $just_marketvalue_last=0;
                $ass_value_last=0;
                $exmpt_value_last=0;
                $taxable_value_last=0;


              $sql_cambusn = "SELECT
               HIFLBLDG
              ,HIFLXFOB
              ,HIFLLANDN
              ,HIFLTANSC
              ,HIFLTAPPR
              ,HIFLEXEMP3
              ,HIFLTAXBL1
               FROM  PA_CFLHI h
               JOIN PA_CAMPR r
               ON h.HIFLPROP=r.PRPROP
               WHERE PRPYR= $cam_fiscyear
               AND HIFLPYR= $cam_fiscyear-1
               AND PRDISP='".$pin."'";

               $stmt = sqlsrv_query( $conn,  $sql_cambusn);

                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

               while($row = sqlsrv_fetch_array($stmt))
                {
                   $bld_value_current  = $row['HIFLBLDG'];
                   $land_value_current         = $row['HIFLLANDN'];
                   $just_marketvalue_current         = $row['HIFLTAPPR'];
                   $ass_value_current  = $row['HIFLTANSC'];
                   $exmpt_value_current  = $row['HIFLEXEMP3'];
                   $taxable_value_current  = $row['HIFLTAXBL1'];
                   $exfeat_value_current = $row['HIFLXFOB'];
                }

                 $bld_value_current  = "$".number_format(round($bld_value_current));
               $land_value_current = "$".number_format(round($land_value_current));
               $just_marketvalue_current = "$".number_format(round($just_marketvalue_current));
               $ass_value_current = "$".number_format(round($ass_value_current));
               $exmpt_value_current = "$".number_format(round($exmpt_value_current));
               $taxable_value_current = "$".number_format(round($taxable_value_current));
               $exfeat_value_current = "$".number_format(round($exfeat_value_current));




              $sql_cambusn = "SELECT
               HIFLBLDG
              ,HIFLXFOB
              ,HIFLLANDN
              ,HIFLTANSC
              ,HIFLTAPPR
              ,HIFLEXEMP3
              ,HIFLTAXBL1
               FROM  PA_CFLHI h
               JOIN PA_CAMPR r
               ON h.HIFLPROP=r.PRPROP
               WHERE PRPYR= ($cam_fiscyear)
               AND HIFLPYR= ($cam_fiscyear-2)
               AND PRDISP='".$pin."'";




               $stmt = sqlsrv_query( $conn,  $sql_cambusn);

                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

               while($row = sqlsrv_fetch_array($stmt))
                {
                   $bld_value_last = $row['HIFLBLDG'];
                   $land_value_last = $row['HIFLLANDN'];
                   $just_marketvalue_last = $row['HIFLTAPPR'];
                   $ass_value_last = $row['HIFLTANSC'];
                   $exmpt_value_last = $row['HIFLEXEMP3'];
                   $taxable_value_last = $row['HIFLTAXBL1'];
                   $exfeat_value_last = $row['HIFLXFOB'];
                }

                 $bld_value_last  = "$".number_format(round($bld_value_last));
               $land_value_last = "$".number_format(round($land_value_last));
               $just_marketvalue_last = "$".number_format(round($just_marketvalue_last));
               $ass_value_last = "$".number_format(round($ass_value_last));
               $exmpt_value_last = "$".number_format(round($exmpt_value_last));
               $taxable_value_last = "$".number_format(round($taxable_value_last));
               $exfeat_value_last = "$".number_format(round($exfeat_value_last));



          // ag value info
              $luclass=substr($prop_use,2,1);
               if ($luclass >=5 AND $luclass <=6) {


               $sql_cambusn = "SELECT PLLANDAG,PLLANDAGM FROM PA_WVLANDC WHERE DIDISP='".$pin."'";

               $stmt = sqlsrv_query( $conn,  $sql_cambusn);

                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

               while($row = sqlsrv_fetch_array($stmt))
                {
                   $landag_value_current  = $row['PLLANDAG'];
                   $ag_market_value_current = $row['PLLANDAGM'];
                }


             $sql_cambusn = "SELECT PLLANDAG,PLLANDAGM FROM PA_WVLANDP WHERE DIDISP='".$pin."'";

               $stmt = sqlsrv_query( $conn,  $sql_cambusn);

                if( $stmt === false )
               {
                  echo "Error in statement preparation/execution.\n";
                  die( print_r( sqlsrv_errors(), true));
               }

               while($row = sqlsrv_fetch_array($stmt))
                {
                   $landag_value_last  = $row['PLLANDAG'];
                   $ag_market_value_last = $row['PLLANDAGM'];
                }


                  $landag_value_current = "$".number_format(round($landag_value_current));
                  $landag_value_last = "$".number_format(round($landag_value_last));

                  $ag_market_value_current = "$".number_format(round($ag_market_value_current));
                  $ag_market_value_last = "$".number_format(round($ag_market_value_last));

                  //$just_marketvalue_current = $ag_market_value_current ;
                  $just_marketvalue_last = $ag_market_value_last ;

                  $landag_value_current = $taxable_value_current;
                  $landag_value_last = $taxable_value_last;


                }


    if ($pin_exists==0){
	    $owner="<b>no records returned</b>";
		 $maddress="";
		 $maddress_2="";
		 $taxdist="";
		 $Laddress="";
		 $prop_use="";
		 $sec ="";
		 $hmstd="";
		 $prop_use="";
		 $prop_use_desc="";
	}

?>

  <div id="tabs" class="tabdiv">

	<ul id="tablist">
		<li><a href="#tab_Parcel">Parcel Info</a></li>
		<li><a href="#tab_Extra">Additional Info</a></li>
		<li><a href="#tab_BldSketch">Building Sketch</a></li>
		<li><a href="#tab_TaxInfo">Tax Info</a></li>

 <?php

     //if ($refsrc !="na"){
     //   echo "<li id=\"advmap\"><a href=\"#tab_MapLink\">Advanced Interactive Map</a></li>";
     //}

 ?>
	</ul>
    <div id="tab_Parcel">
         <table class="table_class">
            <tr>
               <td class="table_header" colspan="4">
                  Owner and Parcel Information
               </td>
            </tr>
            <tr>
               <td class="cell_header">
                  <font color="#27408B">Owner Name</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $owner; ?>&nbsp;
               </td>
               <td class="cell_header">
                  <font color="#27408B">Today&#39;s Date</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $today; ?>&nbsp;
               </td>
            </tr>
            <tr>
               <td class="cell_header">
                  <font color="#27408B">Mailing Address</font> &nbsp;
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $maddress ?>&nbsp;
               </td>
               <td class="cell_header">
                  <font color="#27408B">Parcel Number</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $pin; ?>&nbsp;
               </td>
            </tr>
            <tr>
               <td class="cell_header">
                  &nbsp;
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $maddress_2; ?>&nbsp;
               </td>
               <td class="cell_header">
                  <font color="#27408B">Tax District</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $taxdist; ?>&nbsp;
               </td>
            </tr>
            <tr>
               <td class="cell_header">
                  <font color="#27408B">Location Address</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo trim($Laddress); ?>&nbsp;
               </td>
               <td class="cell_header">
                  <font color="#27408B"><?php echo $cam_fiscyear ; ?> Millage Rates</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $millage; ?>&nbsp;
               </td>
            </tr>
            <tr>
               <td class="cell_header">
                  <font color="#27408B">Property Usage</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $prop_use_desc."(".$prop_use.")"; ?>&nbsp;
               </td>
               <td class="cell_header">
                  <font color="#27408B">Acreage Assessed</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $prop_acres; ?>&nbsp;
               </td>
            </tr>
            <tr>
               <td class="cell_header">
                  <font color="#27408B">Section Township Range</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo trim($sec); ?> &nbsp;
               </td>
               <td class="cell_header">
                  <font color="#27408B">Homestead</font>
               </td>
               <td class="cell_value">
                  &nbsp;<?php echo $hmstd; ?>&nbsp;
               </td>
            </tr>
            <tr>
               <td class="cell_header">
                  <font color="#27408B">Business Name</font>
               </td>
               <td class="cell_value" colspan="3">
                  &nbsp;<?php echo $busness; ?>&nbsp;
               </td>
            </tr>
         </table>
         <table class="sketch">
            <tr class="sketch">
               <td class="sketch_main">



               </td>
            </tr>
         </table>
         <table class="table_class">
            <tr>
               <td class="table_header">
                  Value Information
               </td>
               <td class="table_header">
                  Legal Information
               </td>
            </tr>
            <tr>
               <td width="600">
                  <table class="table_class">
                    <tr>
                        <td class="cell_value">
                           &nbsp;
                        </td>
                        <td class="cell_value" align="right" nowrap="nowrap">
                           <font color="#27408B"><?php echo $cam_fiscyear -2 ; ?> Certified Values</font>
                        </td>
                        <td class="cell_value" align="right" nowrap="nowrap">
                           <font color="#27408B"><?php echo $cam_fiscyear -1 ; ?> Certified Values</font>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Building Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $bld_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $bld_value_current ;  ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Extra Feature Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $exfeat_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $exfeat_value_current ; ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Land Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $land_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $land_value_current ;  ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Land Agricultural Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $landag_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $landag_value_current ; ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Agricultural (Market) Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $ag_market_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $ag_market_value_current ; ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Just (Market) Value*</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $just_marketvalue_last ;  ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $just_marketvalue_current ;  ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Assessed Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $ass_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $ass_value_current ; ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Exempt Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $exmpt_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $exmpt_value_current ; ?>
                        </td>
                     </tr>
                     <tr>
                        <td class="cell_header">
                           <font color="#27408B">Taxable Value</font>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $taxable_value_last ; ?>
                        </td>
                        <td class="cell_value" align="right">
                           <?php echo $taxable_value_current ; ?>
                        </td>
                     </tr>
                  </table>&quot;Just (Market) Value&quot; description - This is the value established by the Property Appraiser for ad valorem purposes. This value does not
                  represent anticipated selling price.<br />
                  <br />
                  <table class="sketch">
                     <tr class="sketch">
                        <td class="sketch_main">
                                         <!--   <a href='https://www.okaloosa.county-taxes.com/public/real_estate/parcels/<?php echo str_replace("-","",$pin); ?>' target="_new"><img src="..\images/tax_info.gif" border="0"></a>-->
                        </td>
                        <td class="sketch_main">
                           &nbsp;
                        </td>
                     </tr>
                  </table>
               </td>
               <td align="center">
                  <?php echo $legal_desc_hold; ?><br />
                  <br />
                  <b>The legal description shown here may be condensed for assessment purposes. Exact description should be obtained from the recorded deed.</b>
               </td>
            </tr>
         </table><br /><br /><br />

</div><!--  end Parcel div -->

<div id="tab_Extra">




         <?php

                  $blditmcnt=0;
                   $roofcnt=0;

                  //$sql_cambl = "SELECT * FROM pa_cambl WHERE BLPROP = '".$prop_num."' ";

                  //$sql_cambl = "SELECT   cv.BVALDS,cl.* FROM  PA_CAMBL cl JOIN PA_CAMBVAL cv ON cl.BLBVAL=cv.BVALCD WHERE BLPROP = '".$prop_num."' ";

                  //$sql_cambl = "SELECT   cv.BVALDS,cl.* FROM  PA_CAMBL cl JOIN PA_CAMBVAL cv ON cl.BLBVAL=cv.BVALCD JOIN PA_OLVIEW1 ov ON BLPROP=PRCL_PARCEL_NUMBER WHERE ov.BLDG > 0 AND  PRCL_PARCEL_NUMBER = '".$prop_num."' ";


                  $sql_cambl="SELECT cv.BVALDS,cl.* FROM PA_CAMBL cl LEFT OUTER JOIN PA_CAMBVAL cv ON cl.BLBVAL=cv.BVALCD WHERE BLPROP= '".$prop_num."' ";

                  $stmt = sqlsrv_query( $conn, $sql_cambl);


                  if( $stmt === false )
                  {
                     echo "Error in statement preparation/execution.\n";
                     die( print_r( sqlsrv_errors(), true));
                  }

                  $roof_cover_1="";
				  $roof_cover_2="";
                  while($row = sqlsrv_fetch_array($stmt))
                  {

					//echo $blditmcnt."<BR>";


                     $blditmcnt=$blditmcnt+1;
                     //$type = $row['BLPTYP'];
                     $type = $row['BVALDS'];
                     $total_area = $row['BLSFAC'];
                     $heated_area = $row['BLSFHT'];
                     $ext_wall_1 = $row['BLEXW1'];
                     $ext_wall_2 = $row['BLEXW2'];
                     $roof_cover_1 = $row['BLRCV1'];
                     $roof_cover_2 = $row['BLRCV2'];
                     $int_wall_1 = $row['BLINT1'];
                     $int_wall_2 = $row['BLINT2'];
                     $flooring_1 = $row['BLFLR1'];
                     $flooring_2 = $row['BLFLR2'];
                     $flooring_3 = $row['BLFLR2P'];
                     $heat_type = $row['BLHEAT'];
                     $ac_type = $row['BLAIRC'];
                     $baths = $row['BL#BAT'];
                     if ($baths==0) { $baths="0"; }
                     $bedrooms = $row['BL#BDR'];
                     $stories = $row['BL#STY'];

                     $stories=round($stories);

                     $act_year_built = $row['BLAYB'];
                     $eff_year_built = $row['BLEYB'];


                     $sql_camheat = "SELECT *  FROM pa_camheat WHERE HEATMODL =(SELECT MAX(HEATMODL) FROM PA_CAMHEAT) AND   HEATCD = '".$heat_type."' ";
                     $stmtt = sqlsrv_query( $conn, $sql_camheat);
                     if( $stmt === false ) {
                        echo "Error in statement preparation/execution.\n";
                        die( print_r( sqlsrv_errors(), true));
                     }

                     while($row = sqlsrv_fetch_array($stmtt)) {
                        $heat_type = $row['HEATDS'];
                     }



                     // AC Desc
                     $sql_camheat = "SELECT  AIRCCD  , AIRCDS  FROM [CENTRAL_GIS].[dbo].[PA_CAMAIRC] WHERE AIRCCD='".$ac_type."'";

                     $stmtt = sqlsrv_query( $conn, $sql_camheat);

                     if( $stmtt === false )
                     {
                        echo "Error in statement preparation/execution.\n";
                        die( print_r( sqlsrv_errors(), true));
                     }

                     while($row = sqlsrv_fetch_array($stmtt))
                     {

                        $ac_type = $row['AIRCDS'];
                     }

                     // Exterior Wall Type Desc

                   $sql_camheat = "SELECT  EXTWCD,EXTWDS   FROM [CENTRAL_GIS].[dbo].[PA_CAMEXTW] WHERE EXTWCD='".$ext_wall_1."'";


                     $stmtt = sqlsrv_query( $conn, $sql_camheat);

                     if( $stmtt === false )
                     {
                        echo "Error in statement preparation/execution.\n";
                        die( print_r( sqlsrv_errors(), true));
                     }

                     while($row = sqlsrv_fetch_array($stmtt))
                     {

                        $ext_wall_1 = $row['EXTWDS'];
                     }


                     // Interior Wall

                   $sql_camheat = "SELECT  INTWCD,INTWDS  FROM [CENTRAL_GIS].[dbo].[PA_CAMINTW] WHERE INTWCD='".$int_wall_1."'";


                     $stmtt = sqlsrv_query( $conn, $sql_camheat);

                     if( $stmtt === false )
                     {
                        echo "Error in statement preparation/execution.\n";
                        die( print_r( sqlsrv_errors(), true));
                     }

                     while($row = sqlsrv_fetch_array($stmtt))
                     {

                        $int_wall_1 = $row['INTWDS'];
                     }


                     // Flooring
                     $sql_camheat = "SELECT  FLORDS  FROM [CENTRAL_GIS].[dbo].[PA_CAMFLOR] WHERE FLORCD='".$flooring_1."' AND FLORDS <> 'CER TILE' AND FLORDS <> 'CLAY TILE'   UNION   "."SELECT  FLORDS  FROM [CENTRAL_GIS].[dbo].[PA_CAMFLOR] WHERE FLORCD='".$flooring_2."' AND FLORDS <> 'CER TILE' AND FLORDS <> 'CLAY TILE'";



                     $stmtt = sqlsrv_query( $conn, $sql_camheat);

                     if( $stmtt === false )
                     {
                        echo "Error in statement preparation/execution.\n";
                        die( print_r( sqlsrv_errors(), true));
                     }
                     $flooring_1 = "";
                     $flcnt=0;
                     while($row = sqlsrv_fetch_array($stmtt))
                     {


      					if ($flcnt==0){
      					   $flooring_1 = $row['FLORDS'];
      					} else {

      					   $flooring_1 .="/".$row['FLORDS'];
      					}
                        $flcnt=$flcnt+1;
                     }

                   $flooring_1=preg_replace('/.\//','',$flooring_1);


                   // Get roof structure type description(s)
                  $wherestr="WHERE ";
                     if (is_numeric($roof_cover_1)){
                         $wherestr .=" RSTRCD=".$roof_cover_1;
                     }
                     if (is_numeric($roof_cover_2)){
                         $wherestr .=" OR RSTRCD=".$roof_cover_2;
                     }

                     //$sqlst = "SELECT DISTINCT  RSTRDS FROM [CENTRAL_GIS].[dbo].[PA_CAMRSTR] ".$wherestr;
                     $sqlst = "select RCVRDS  from PA_CAMRCVR where RCVRCD=".$roof_cover_1." and RCVRMODL IN (select MAX(RCVRMODL) as RCVRMODL from PA_CAMRCVR where RCVRCD=".$roof_cover_1.")";


                     $stmtt = sqlsrv_query( $conn, $sqlst);

                     if( $stmtt === false )
                     {
                        echo "Error in statement preparation/execution.\n";
                        die( print_r( sqlsrv_errors(), true));
                     }


                     while($row = sqlsrv_fetch_array($stmtt))
                     {
      					//if ($roofcnt==0){
      					   $roof_cover_1 = $row['RCVRDS'];
      					//} else {

      					   //$roof_cover_1 .="/".$row['RSTRDS'];
      					//}
                        $roofcnt=$roofcnt+1;
                     }

                  $bldmhr="Building #".$blditmcnt;
                  if ($blditmcnt==1){
                     $bldmhr="Building Information";
                  }
                  ?>
                   <table class="table_class"><tr><td align="center" class="table_header" colspan="7"><?php echo $bldmhr; ?></td></tr>



            <tr>
               <td class="cell_header" align="center">
                  <font color="#27408B">Type</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Total Area</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Heated Area</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Exterior Wall</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Roof Cover</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Interior Wall</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Flooring</font>
               </td>
            </tr>
            <tr>
               <td class="cell_value" align="center">
                  <?php echo $type; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo number_format($total_area); ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo number_format($heated_area); ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $ext_wall_1; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php



                    echo $roof_cover_1;

                    //if ($roof_cover_2 !="") {
                    //    echo "/".$roof_cover_2;
                    //}



                  ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $int_wall_1; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $flooring_1; ?>&nbsp;
               </td>
            </tr>
            <tr>
               <td class="cell_header" align="center">
                  <font color="#27408B">Heating Type</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">A/C Type</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Baths</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Bedrooms</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Stories</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Actual Year Built</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Effective Year Built</font>
               </td>
            </tr>
            <tr>
               <td class="cell_value" align="center">
                  <?php echo $heat_type; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $ac_type; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $baths; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $bedrooms; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $stories; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $act_year_built; ?>&nbsp;
               </td>
               <td class="cell_value" align="center">
                  <?php echo $eff_year_built; ?>&nbsp;
               </td>
            </tr>

       </table><BR>








<?php }

 if ($blditmcnt==0) { ?>
         <table class="table_class"><tr><td align="center" class="table_header" colspan="7">Building Information</td></tr>
            <tr><td class="cell_header" align="center"><font color="#27408B"><i>No buildings associated with this parcel.</i></font></td>
          </table>
<?php    } ?>


</table><br />


         <table class="table_class">
            <tr>
               <td class="table_header" align="center" colspan="6">
                  Extra Features Data
               </td>
            </tr>
<?php

                       $xtrafeatcnt=0;
                       $sql_camxf = "SELECT *
                                   FROM pa_camxf
                                   WHERE XFPROP = '".$prop_num."' ";

                       //$rs_xfeatures=odbc_exec($conn,$sql_camxf);
                       //if (!$rs_xfeatures){exit("<br>Error in insert SQL<br>".$sql_camxf);}
                       //while($row = odbc_fetch_array($rs_xfeatures))
                       $stmt = sqlsrv_query( $conn, $sql_camxf);

                       if( $stmt === false )
                       {
                          echo "Error in statement preparation/execution.\n";
                          die( print_r( sqlsrv_errors(), true));
                       }

                       while($row = sqlsrv_fetch_array($stmt))
                       {
                           $xtrafeatcnt=$xtrafeatcnt+1;
                           $desc = $row['XFDESC'];
                           $num_units = $row['XFQTY'];
                           $unit_l = $row['XFDIM1'];
                           $unit_2 = $row['XFDIM2'];
                           $unit_3 = $row['XFDIM3'];
                           $unit_lwh = $unit_l." x ".$unit_2." x ".$unit_3;
                           $unit = round($row['XFUNIT']);
                           $unit_type = $row['XFUT'];
                           $eff_year_built = $row['XFEYB'];
/*
                           echo "<tr>";
                           echo "<td class='sales_value' align='center'>&nbsp; $desc &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $num_units &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $unit_lwh &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $unit $unit_type &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $eff_year_built &nbsp;</td>";
                           echo "</tr>";
*/
                       }

                       if ($xtrafeatcnt==0) {
                    ?>



    <tr>
               <td class="cell_value" colspan="7" align="center">
                  No records associated with this parcel.
               </td>
    </tr>

 <?php
                 } else {

?>

            <tr>
               <td class="cell_header" align="center">
                  <font color="#27408B">Description</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Number of Items</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Unit Length x Width x Height</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Units</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Effective Year Built</font>
               </td>
            </tr>
<?php

                       $stmt = sqlsrv_query( $conn, $sql_camxf);

                       if( $stmt === false )
                       {
                          echo "Error in statement preparation/execution.\n";
                          die( print_r( sqlsrv_errors(), true));
                       }

                       while($row = sqlsrv_fetch_array($stmt))
                       {

                           $desc = $row['XFDESC'];
                           $num_units = $row['XFQTY'];
                           $unit_l = $row['XFDIM1'];
                           $unit_2 = $row['XFDIM2'];
                           $unit_3 = $row['XFDIM3'];
                           $unit_lwh = $unit_l." x ".$unit_2." x ".$unit_3;
                           $unit = round($row['XFUNIT']);
                           $unit_type = $row['XFUT'];
                           $eff_year_built = $row['XFEYB'];

                           echo "<tr>";
                           echo "<td class='sales_value' align='center'>&nbsp; $desc &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $num_units &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $unit_lwh &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $unit $unit_type &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $eff_year_built &nbsp;</td>";
                           echo "</tr>";

                       }
                 }





 ?>




         </table><br />
         <table class="table_class">
            <tr>
               <td class="table_header" colspan="5">
                  Land Information
               </td>
            </tr>
            <tr>
               <td class="cell_header" align="center">
                  <font color="#27408B">LAND USE</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">NUMBER OF UNITS</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">UNIT TYPE</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Frontage</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Depth</font>
               </td>
            </tr><?php
                       //$sql_camla = "SELECT *  FROM pa_camla WHERE LAPROP = '".$prop_num."' ";
                       //$sql_camla = "SELECT p.*,USECDS FROM pa_camla p LEFT OUTER JOIN   PA_CAMUSEC u ON p.LALVAL=u.USECCD WHERE LASEQNO=1 AND LAPROP = '".$prop_num."' ";

                      $sql_camla = "SELECT   cl.*,cv.LVALDS   FROM [CENTRAL_GIS].[dbo].[PA_CAMLA]  cl JOIN PA_CAMLVAL cv ON cl.LALVAL=cv.LVALCD WHERE LAPROP= '".$prop_num."' ";


                       //$rs_land=odbc_exec($conn,$sql_camla);
                       //if (!$rs_land){exit("<br>Error in insert SQL<br>".$sql_camla);}
                       //while($row = odbc_fetch_array($rs_land))

                       $stmt = sqlsrv_query( $conn, $sql_camla);

                       if( $stmt === false )
                       {
                          echo "Error in statement preparation/execution.\n";
                          die( print_r( sqlsrv_errors(), true));
                       }
                       $land_use ="";
                       while($row = sqlsrv_fetch_array($stmt))
                       {
                           //$land_use = $row['USECDS'];
                           $land_use = $row['LVALDS'];
                           //$land_units = round($row['LAUNIT']);
                           $land_units =  round($row['LAUNIT'],2);
                           $unit_type = $row['LAUT'];
                           $frontage = $row['LAFRONT'];
                           $dept = $row['LADEPTH'];

                           echo "<tr>";
                           echo "<td class='sales_value' align='center'>&nbsp;$land_use &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $land_units &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $unit_type &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $frontage &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $dept &nbsp;</td>";
                           echo "</tr>";
                       }
                    ?>
         </table><br />
         <table class="table_class">
            <tr>
               <td class="table_header" colspan="10">
                  Sale Information
               </td>
            </tr>
            <tr class="">
               <td class="cell_header" align="center">
                  <font color="#27408B">Sale Date</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Sale Price</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Instrument</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Deed Book</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Deed Page</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Sale Qualification</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Vacant or Improved</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Grantor</font>
               </td>
               <td class="cell_header" align="center">
                  <font color="#27408B">Grantee</font>
               </td>
            </tr><?php
                       $sql_camsa = "SELECT sa.*,SINSDS
                                     FROM pa_camsa sa
                                     JOIN PA_CAMSINS si
                                     ON sa.SASINS=si.SINSCD
                                     WHERE SAPROP = '".$prop_num."'
                                     ORDER BY sardate DESC";




                       //$rs_sale=odbc_exec($conn,$sql_camsa);
                       //if (!$rs_sale){exit("<br>Error in insert SQL<br>".$sql_camsa);}
                       $odd_even = 0;
                       //while($row = odbc_fetch_array($rs_sale))
                       $stmt = sqlsrv_query( $conn, $sql_camsa);

                       if( $stmt === false )
                       {
                          echo "Error in statement preparation/execution.\n";
                          die( print_r( sqlsrv_errors(), true));
                       }

                       while($row = sqlsrv_fetch_array($stmt))
                       {
                           $sale_date = $row['SARDATE'];
                           $sale_date = $newDate = date("m-d-Y", strtotime($sale_date));
                           $sale_price = $row['SAPRICE'];
                           $sale_price = number_format($sale_price);
                           $instrument = $row['SINSDS'];

                           $deed_book = $row['SARBOOK'];
                           $deed_page = $row['SARPAGE'];
                           $sale_qual = $row['SAQU'];
                           $vac_imp = $row['SAVI'];
                           /*
                           if ($sale_qual == 'Q')
                           {
                              $sale_qual = 'Qualified';
                           } else {
                              $sale_qual = 'Unqualified';
                           }

                           if ($vac_imp == "I")
                           {
                              $vac_imp = 'Improved';
                           } else {
                              $vac_imp = 'Vacant';
                           }
                           */

                           $grantor = $row['SAGNTR'];
                           $grantee = $row['SAGNTE'];
                           if ($odd_even == 0)
                           {
                              $odd_even_row = "odd";
                              $odd_even = 1;
                           } else {
                              $odd_even_row = "even";
                              $odd_even = 0;
                           }

                           echo "<tr class='$odd_even_row'>";
                           echo "<td class='sales_value' align='center'>&nbsp; $sale_date &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $$sale_price &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $instrument &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp;
                                 <a href='http://officialrecords.clerkofcourts.cc/oncoreweb/showdetails.aspx?Book=$deed_book&Page=$deed_page&BookType=OR' target='new'>
                                 $deed_book</a> &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp;
                                 <a href='http://officialrecords.clerkofcourts.cc/oncoreweb/showdetails.aspx?Book=$deed_book&Page=$deed_page&BookType=OR' target='new'>
                                 $deed_page</a> &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $sale_qual &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $vac_imp &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $grantor &nbsp;</td>";
                           echo "<td class='sales_value' align='center'>&nbsp; $grantee &nbsp;</td>";
                           echo "</tr>";

                       }
                    ?>
         </table>


  </div><!--  end Extra div -->


 <div id="tab_BldSketch">

    <div id="divTrav" style="width:100%;height:800px">


<?php
   if ($blditmcnt > 1) {
?>
      <div  style="font-family:Verdana,Arial,helvetica;font-size:8pt">
		  Select a building to view:  <select style="font-family:Verdana,Arial,helvetica;font-size:8pt" id="bldtravselc" onchange="showbuildingsketch(this.value)">
<?php

      for ($x=1; $x<=$blditmcnt; $x++) {
          echo "<option value=\"".$x."\">Building #$x</option>";
      }
?>
    </select> </div>
<?php  }
?>


         <iframe id="bldsketchframe" src="" style="width:100%;height:100%"></iframe>

    </div>

 </div><!--  end BldSketch div -->


<div id="tab_TaxInfo">
 <a href='https://www.okaloosa.county-taxes.com/public/real_estate/parcels/<?php echo str_replace("-","",$pin); ?>' target="_new"><img src="..\images/tax_info.gif" border="0"></a>

</div><!--  end TaxInfo div -->

</div><!--  end Map div -->



<!--<div id="tab_MapSimple">
     <div id="divSimpleMap" style="height:600px;width:100%">
         <div id="smap" class="pdiv" style="width: 100%; height: 100%; top:0%; left: 0%">



         </div>
     </div>
</div>--><!--  end simple Map div -->




 <?php
     //if ($refsrc !="na"){
     //     echo "<div id=\"tab_MapLink\"><div id=\"divMapLink\" style=\"height:200px\"></div></div>";
     //}
 ?>


 </div><!--  end tabs div -->




<div id="footer" class="prc_footer">
         <center>

            <table class="table_class">
               <tr>
                  <td class="caption">
                     The Okaloosa County Information Systems Office makes every effort to produce the most accurate information possible. No warranties, expressed or implied,
                     are provided for the data herein, its use or interpretation.
                  </td>
               </tr>
            </table>
            <center>
               <font size="-2"><b>&copy; 2015 by the County of Okaloosa, FL</b></font>
            </center>
         </center>
      </center>
 </div>
 <br>
  <center><input id="btnClose" style="font-size:11px;!important;width:300px" type="button" class="cbutton"  onclick="window.close();"  value="Close This Window"/> </center>

    <div id="advmapbd" style="overflow: hidden;position:absolute; ">

    </div>
    <div id="plugindetect" style="overflow: hidden;position:absolute; ">

    </div>
  <!--<img id="rimg" src="http://204.49.20.76/bg.png" width="1" height="1" alt="">-->
<script>


    var mapurl= "http://" + document.location.host + "/pa_map/?parcel=<?php echo trim($pin) ?>&layers=parcels+aerials";
    var travurl= "http://" + document.location.host + "/traversal/bldsketch.htm?pin=<?php echo trim($pin) ?>&building=1";


function showAdvMapButton(){

    var dlgcont = "";
    dlgcont = dlgcont + '<input id="btnAdvMp" style="width:99%" type="button" class="cbutton"  onclick="showadvmap();"  value="Advanced Map"/>';
    $('#advmapbd').html(dlgcont);

	var dtabs=document.getElementById('tabs');
    var dbd=document.getElementById('advmapbd');

    dbd.style.left=(dtabs.offsetWidth - 450 ) + "px";
    dbd.style.top = (dtabs.offsetTop + 5) + "px";

}



function updateadvmap() {

	 var qs=parseQuery(window.location.search.substring(1));
	 if (qs.cl=="mapqry") {
	      console.log("mapqry: true"  );
	      isMapChild=true;
	 }

     if (isMapChild) {
        try {
   	      if (opener) {
		      console.log("window.opener - changing map pin");
		      window.opener.loadpin(<?php echo "\"$pin\""; ?>);

          } else if (window.opener.postMessage) {
              console.log("could not get window.opener - trying postMessage for changing map pin");
              window.opener.postMessage("pin:<?php echo $pin; ?>","*");  // ask the Map to do something

          } else {
              console.log("cannot get access to map window...just launching it again");

          }

	    } catch(e) {
	        console.log("error accessing opener" );
	        console.log(e);

        }
     } else {
        console.log("is not from map opening new window" );

     }


}


function showadvmap() {

      console.log("showing advanced map");

     $('#divMapLink').html("opening map window");
     var dlgcont = '<div style="top:90px;left:25%;width:35%;height:15%;font-size: 8pt"><br>';

	 var qs=parseQuery(window.location.search.substring(1));
	 if (qs.cl=="mapqry") {
	      console.log("mapqry: true"  );
	      isMapChild=true;
	 }

     console.log("isMapChild: " + isMapChild);

     if (isMapChild) {
        try {
   	      if (opener) {
		      console.log("window.opener - changing map pin");
		      window.opener.loadpin(<?php echo "\"$pin\""; ?>);
		      dlgcont = dlgcont + '<p style="font-size: 12pt">Please select the existing map tab or map window to see your selection</p><br><br><br><br>';
          } else if (window.opener.postMessage) {
              console.log("could not get window.opener - trying postMessage for changing map pin");
              window.opener.postMessage("pin:<?php echo $pin; ?>","*");  // ask the Map to do something
              dlgcont = dlgcont + '<p><b>Please select the existing map tab or map window to see your new selection.</b></p><br><br>';
          } else {
              console.log("cannot get access to map window...just launching it again");
              justOpenMap();
          }

	    } catch(e) {
	        console.log("error accessing opener" );
	        console.log(e);
	        justOpenMap();
        }
     } else {
        console.log("is not from map opening new window" );
        justOpenMap();
     }


     //dlgcont = dlgcont + '<br><p>Try the link below if your browser does not open the map window when this tab is selected. </p><br>';
	 //dlgcont = dlgcont + '<input id="btnAdvMp1" style="width:99%" type="button" class="cbutton"  onclick="justOpenMap();"  value="Try Opening Map Again"/><br>';

	 //dlgcont = dlgcont + '<input id="btnAdvMp2" style="width:99%" type="button" class="cbutton"  onclick="OpenSimpleMap();"  value="Try Alternate Map Viewer"/><br>';

	 //dlgcont = dlgcont + '<input id="btnAdvMp" style="width:99%" type="button" class="cbutton"  onclick="showadvmap();"  value="Try Google Maps"/><br>';
	 dlgcont = dlgcont + '';
	 dlgcont = dlgcont + '</div>'

     $('#divMapLink').html(dlgcont);



}

function justOpenMap(){
   window.open("http://204.49.20.76/PublicWeb/PA_WebMap.html?pin=<?php echo $pin; ?>" ,"_self");
}
function  OpenSimpleMap(){
   var mapurl= "http://" + document.location.host + "/pa_map/?parcel=<?php echo trim($pin) ?>&layers=parcels+aerials";
   window.open(mapurl ,"_self");
}


function getMapReport() {

    var iurl = 'http://' + document.location.host + '/pa_map/pa.asmx/GetPrintMap?pin=<?php echo trim($pin); ?>';
    console.log("getMapReport: " + iurl);
    $.support.cors = true;

    $.ajax({
        type: 'GET',
        //crossDomain: true,
        url: iurl,
        cache: false,
        //data: { postVar1: 'theValue1', postVar2: 'theValue2' },
        //dataType: 'json',
        //contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#map').html('<br><br><br><br><div class="loading"><img src="../images/ajax-loader3.gif" alt="Loading..." /></div>');
        },
        success: function (msg) {
            var result = msg.documentElement;
            var jsonr = "";
            var xmlDoc;
            if (document.implementation && document.implementation.createDocument) {
                jsonr = result.textContent;
            } else if (window.ActiveXObject) {
                jsonr = result.text;
            }
            $('#map').html('<iframe id="maprepframe" src="' + jsonr + '" style="width:100%;height:100%"></iframe>');
        },
        error: function (xhr, status, error) {

		 console.log(xhr.status);
		 console.log(error);
        }
    });

}


function loadMap(){

      getMapReport();



}






// end map functions





 var ismapframe=false;
 var issketchframe=false;
 var ismaprep=false;



$(function () {
     $("#tabs").tabs();

    $("#tabs").tabs({

            beforeLoad: function (event, ui) {
               console.log("before unload");
                if (ui.tab.data("loaded")) {
                    event.preventDefault();
                    return;
                }
                ui.ajaxSettings.cache = false,
                ui.panel.html('  Loading...'),
                ui.jqXHR.success(function() {
                    ui.tab.data( "loaded", true );
                }),
                ui.jqXHR.error(function () {
                    ui.panel.html(
                    "Couldn't load Data. Plz Reload Page or Try Again Later.");
                });
            },

        activate: function (event, ui) {
            //showAdvMapButton();
            var selected = ui.newTab.context.innerHTML;
            if (selected == "Property Map Report") {
                 console.log("ismaprep: " + ismaprep);
                 if (!ismaprep) {
                    ismaprep=true;
                    loadMap();
                 }

            } else  if (selected == "Simple Interactive Map") {

                 var smapwin=window.open(mapurl ,"_self");
            } else  if (selected == "Advanced Interactive Map") {

                 //showadvmap();
                 //$('#divMapLink').html('<embed type="application/x-shockwave-flash" src="http://204.49.20.76/PublicWeb/PA_WebMap.swf?pin=<?php echo $pin; ?>" name="plugin" height="94%" width="100%">');

                 if (!ismapframe) {
					 ismapframe=true;
					 adjAdvMaplayout();
					 document.getElementById("tab_MapLink").style.padding="2px";

					 $('#divMapLink').html('<iframe id="advmapframe" style="width:100%;height:95%" src="http://204.49.20.76/PublicWeb/PA_WebMap.html?pin=<?php echo $pin; ?>"></iframe>');
                 }




            } else  if (selected == "Tax Info") {
                 var txwin=window.open("https://www.okaloosa.county-taxes.com/public/real_estate/parcels/<?php echo str_replace("-","",$pin); ?>","taxinfo");
            } else  if (selected == "Building Sketch") {
                 if (!issketchframe) {
                    issketchframe=true;
                    showbuildingsketch(1);
                 }
            }

        }
    });

 });

function showbuildingsketch(bldnum){
      console.log("http://" + document.location.host + "/traversal/bldsketch.htm?pin=<?php echo $pin; ?>&building=" + bldnum);
      var mrfrm = document.getElementById('bldsketchframe');
      mrfrm.src = "http://" + document.location.host + "/traversal/bldsketch.htm?pin=<?php echo $pin; ?>&building=" + bldnum;

}

</script>



    <script>

       var pin_geom=null;
/*
var browser_info = getAcrobatInfo();
console.log(browser_info);
if(browser_info.acrobat == null){
   //document.location.href = "http://www.getacrobataddress.c..."
}

var status = PluginDetect.isMinVersion("Java", 0, "getJavaInfo.jar" );

var displayResults = function($$){

   var status = $$.isMinVersion("Java", "1.6");
   var version = $$.getVersion("Java");
   alert(status);

};

// Wait for window to load, then execute event handler
//PluginDetect.onWindowLoaded(displayResults);




             var T = function(){

                 var version = PluginDetect.getVersion("Flash");    console.log("FLASH version: " + version);
                   var pversion = PluginDetect.getVersion("AdobeReader");    console.log("adobe version: " + pversion);
                 };
              PluginDetect.onWindowLoaded(T);
*/


    </script>
    <script language="JavaScript" type="text/javascript">

        var dlgcont = "";
		try {
		   var pck=readCookie("r_pins");
		   var pins = pck.split("|");
		   var c_pin= "<?php echo $pin;  ?>";
		   var last_pin=c_pin;
		   var next_pin=c_pin;

		   for (var i=0; i < pins.length; i++) {
				 var pin=pins[i].trim();
				 if (pin=="<?php echo $pin;  ?>") {
					 if (i > 0)   last_pin=pins[i-1].trim();
					 if (i < pins.length - 1)   next_pin=pins[i+1].trim();

				 }
		  }

		   dlgcont =  '<a href="fl_display_dw.php?pin=' + last_pin + '">Previous Parcel</a>';
		   $('#pinprev').html(dlgcont);
		   $('#pinprev2').html(dlgcont);
		   dlgcont =  '<a href="fl_display_dw.php?pin=' + next_pin + '">Next Parcel</a>';
           $('#pinnext').html(dlgcont);
           $('#pinnext2').html(dlgcont);
		} catch(e) {
		   dlgcont = '';
		   $('#pinprev').html(dlgcont);
		   $('#pinprev2').html(dlgcont);
           $('#pinnext').html(dlgcont);
           $('#pinnext2').html(dlgcont);
		}



/*
    if ((last_pin === undefined) || last_pin == "")) last_pin=<?php echo "$pin"; ?>;
    dlgcont = dlgcont + '<a href="fl_display_dw.php?pin=' + last_pin + '">Previous Parcel</a>';
    $('#pinprev').html(dlgcont);

    if (next_pin === undefined) last_pin=<?php echo "$pin"; ?>;
    dlgcont =  '<a href="fl_display_dw.php?pin=' + next_pin + '">Next Parcel</a>';
    $('#pinnext').html(dlgcont);
*/

/*
    var decref=document.referrer;

    if (decref.indexOf("PA_WebMap") != -1) {
        // hide tab


		 $('#tabs').each(function(){

			var $active, $content, $links = $(this).find('a');
			$active = $($links.filter('[href="'+location.hash+'"]')[6] || $links[6]);
			$active.addClass('ui-state-disabled');
			$content = $($active[0].hash);

			// Hide the remaining content
			$links.not($active).each(function () {
			  $(this.hash).hide();
			});


		  });

    }
*/



	      window.onmessage = function (e) {
	           console.log("message recieved : " + e.data);

				if (e.data.indexOf('pin') != -1 ) {
					console.log("got a pin request");
					var pin=e.data.substr(4,23);
					console.log("pin: " + pin);
					document.location="./fl_display_dw.php?cl=mapqry&pin=" + pin;
			    }
	       };

     //window.opener.postMessage("who","*");



     function hideMapTab(){
     	//document.getElementById("advmap").style.visibility="hidden";


     	$("#tab_MapLink").find('a')[0].hide();

		 $('#tabs').each(function(){

			var $active, $content, $links = $(this).find('a');
			$active = $($links.filter('[href="'+location.hash+'"]')[6] || $links[6]);
			$active.addClass('ui-state-disabled');
			$content = $($active[0].hash);

			// Hide the remaining content
			$links.not($active).each(function () {
			  $(this.hash).hide();
			});


		  });



     }
     $(document).ready(function() {


		  try {
            //console.log("opening map window");
			 //var qs=parseQuery(window.location.search.substring(1));
			 //if (qs.cl=="paqrymap")  $("#tabs").tabs("option", "active", 5);
		  } catch(e) {
			   //console.log("ERROR: " + e.message);
		  }


	 });




function adjAdvMaplayout() {

    var otabs=document.getElementById('tabs');
	var otabmaplk=document.getElementById('tab_MapLink');

	var odivmaplk = document.getElementById('divMapLink');
    var odivftr = document.getElementById('footer');

	var dh=document.body.clientHeight;
	var dw=document.body.clientWidth;

	var mdw=Math.max(document.documentElement["clientWidth"] , document.body["offsetWidth"], document.documentElement["offsetWidth"]);
    var mdh=Math.max(document.documentElement["clientHeight"],  document.body["offsetHeight"], document.documentElement["offsetHeight"]);

    odivmaplk.style.height=((mdh - otabmaplk.offsetTop)-odivftr.offsetHeight - 55) + "px";
    //odivmaplk.style.height=((mdh - otabmaplk.offsetTop)-odivftr.offsetHeight - 155) + "px";



}


    </script>



   </body>
</html>

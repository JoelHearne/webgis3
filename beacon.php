<?php
   error_reporting(E_ALL);
   ini_set("display_errors", 1);
   $serverName = "xxxx";
    $connectionInfo = array("UID" => "xxxx", "PWD" => "xxxxxx", "Database"=>"xxxx");


   $conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn === false ) {
echo "cant connect to db";
     die( print_r( sqlsrv_errors(), true));
}

   echo  "beacon";


	$u="";
	$bw=0;
	$lat=0;
	$bw_err=0;
	$lat_err=0;
	$t_done=0;
	$t_resp=0;
	$t_page=0;
	$r="x";

	$cip="";

if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $cip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $cip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $cip = $_SERVER['REMOTE_ADDR'];
}

   echo "remote ip:".$cip."<br>";



  if(isset($_GET['u'])) {
         $u=$_GET['u'];
   }

   if(isset($_GET['bw'])) {
         $bw=$_GET['bw'];
   }

   if(isset($_GET['lat'])) {
         $lat=$_GET['lat'];
   }

   if(isset($_GET['bw_err'])) {
         $bw_err=$_GET['bw_err'];
   }

   if(isset($_GET['lat_err'])) {
         $lat_err=$_GET['lat_err'];
   }

   if(isset($_GET['t_done'])) {
         $t_done=$_GET['t_done'];
   }

   if(isset($_GET['t_resp'])) {
         $t_resp=$_GET['t_resp'];
   }

   if(isset($_GET['t_page'])) {
         $t_page=$_GET['t_page'];
   }

   if(isset($_GET['r'])) {
         $r=$_GET['r'];
   }

echo "got vars<br><br>";

  $sqlqry="INSERT INTO  webgis_client_bandwidth  ([u],[r],[bw],[lat],[t_done],[t_resp],[t_page],[bw_err],[lat_err],c_ip)";
    $sqlqry=$sqlqry." VALUES (  '".$u."','".$r."',".$bw.",".$lat.",".$t_done.",".$t_resp.",".$t_page.",".$bw_err.",".$lat_err.",'".$cip."' )";

   //$sqlqry=$sqlqry." VALUES (  ?,?,?,?,?,?,?,?,?,?)";
   //$var = array($u,$r,$bw,$lat,$t_done,$t_resp,$t_page,$bw_err,$lat_err,$cip);

   //echo  $sqlqry."<br><br>";

    //$stmt = sqlsrv_query( $conn, $sqlqry);

    if (!sqlsrv_query($conn, $sqlqry )) {
            die('Error: ' . sqlsrv_errors());
    }
    echo "1 record added";


//echo $stmt
   		//sqlsrv_free_stmt( $stmt);

         sqlsrv_close( $conn);


?>
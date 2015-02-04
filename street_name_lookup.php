<?php
   error_reporting(E_ALL);
   ini_set("display_errors", 1);
   $serverName = "*****";
   $connectionInfo = array("UID" => "****", "PWD" => "*****", "Database"=>"***");
   $conn = sqlsrv_connect( $serverName, $connectionInfo);


     $is_addr=FALSE;

     $queryString="";
     if(isset($_GET['term'])) {
                  $queryString=$_GET['term'];
     }
     if(isset($_GET['name'])) {
                  $queryString=$_GET['name'];
     }



     //echo $queryString."<BR>";


    // Test if querystring is an address or street name
     try {

        $qs_parts = explode(' ', $queryString);
        $is_addr=is_numeric ($qs_parts[0]);


        //echo $qs_parts[0]."<BR>";
        //echo  "isNumeric ".is_numeric ($qs_parts[0])."<BR>";
        //echo strtoupper ($qs_parts[1])."<BR>";

     } catch (Exception $e) {
           $is_addr=FALSE;
   		//echo 'Caught exception: ',  $e->getMessage(), "\n";
     }
     $rcnt=0;

     echo "[";

     if(!$conn) {
   		// Show error if we cannot connect.
         echo 'ERROR: Could not connect to the database.';
   	} else {


         if(strlen($queryString) > 0) {

                $resfld="msagname";
   				$query = "SELECT distinct top 10 msagname FROM central_siteaddress WHERE name LIKE '$queryString%'ORDER BY msagname";
                   if ($is_addr){
                       $query = "SELECT distinct top 10 str_arcims FROM central_siteaddress WHERE str_arcims LIKE '$queryString%'ORDER BY str_arcims";
                       $resfld="str_arcims";
                   }

   	            $stmt = sqlsrv_query( $conn, $query);

   			    if( $stmt === false )
   			    {
   			  	   echo "Error in statement preparation/execution.\n";
   				   die( print_r( sqlsrv_errors(), true));
   			    }


   			    while($row = sqlsrv_fetch_array($stmt)){
   				        //echo "\n".$row[$resfld] . '     ';
					/*
   				         if ($rcnt==0){
   				           echo  "{\"addr\":\"".$row[$resfld]."\"}";
   				         } else {
   				           echo  ",{\"addr\": \"".$row[$resfld]."\"}";
   				         }
   				   */
   				         if ($rcnt==0){
   				           echo  "{\"name\":\"".$row[$resfld]."\", id:\"$rcnt\"}";
   				         } else {
   				           echo  ",{\"name\": \"".$row[$resfld]."\", id:\"$rcnt\"}";
   				         }




   				         $rcnt=$rcnt+1;
   			    }




   				sqlsrv_free_stmt( $stmt);

   		} else {
   			echo "{name:\"\",id:\"0\"}";
   		}
   	}

     echo "]";
     sqlsrv_close( $conn);
?>
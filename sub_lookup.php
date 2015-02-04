<?php
   error_reporting(E_ALL);
   ini_set("display_errors", 1);
   $serverName = "*****";
   $connectionInfo = array("UID" => "****", "PWD" => "*****", "Database"=>"***");
   $conn = sqlsrv_connect( $serverName, $connectionInfo);


  $queryString="";
  if(isset($_GET['term'])) {
               $queryString=$_GET['term'];
  }
  if(isset($_GET['name'])) {
                  $queryString=$_GET['name'];
 }
  //echo $queryString."<BR>";


  if(!$conn) {
		// Show error if we cannot connect.
      echo 'ERROR: Could not connect to the database.';
	} else {

     $rcnt=0;

     echo "[";
       if(strlen($queryString) > 0) {

				//$query = "SELECT distinct top 10 SUBDDS FROM PA_CAMSUBD WHERE SUBDDS LIKE '$queryString%'ORDER BY SUBDDS";
				//$query = "SELECT distinct top 10 SUBNAME FROM CAMVIEW_Subdivision_Lookup_v2 WHERE SUBNAME LIKE '$queryString%'ORDER BY SUBNAME";

                $query = "SELECT distinct top 10 SUBNAME FROM PA_SubList WHERE SUBNAME LIKE '$queryString%'ORDER BY SUBNAME";



	            $stmt = sqlsrv_query( $conn, $query);

			    if( $stmt === false )
			    {
			  	   echo "Error in statement preparation/execution.\n";
				   die( print_r( sqlsrv_errors(), true));
			    }

			    while($row = sqlsrv_fetch_array($stmt)){
				        //echo "\n".$row['SUBDDS'] . '     ';
    				     if ($rcnt==0){
   				           echo  "{\"name\":\"".trim($row['SUBNAME'])."\", id:\"$rcnt\"}";
   				         } else {
   				           echo  ",{\"name\": \"".trim($row['SUBNAME'])."\", id:\"$rcnt\"}";
   				         }
                        $rcnt=$rcnt+1;
			    }

				sqlsrv_free_stmt( $stmt);

		} else {
			echo "There should be no direct access to this script!";
		}

         echo "]";
	}

     sqlsrv_close( $conn);
?>
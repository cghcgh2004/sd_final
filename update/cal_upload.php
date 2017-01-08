<?php
	require("../config.php");
	require("../PHPExcel/Classes/PHPExcel.php");
	$db_host="dbhome.cs.nctu.edu.tw";
	$db_name="kuoch043_cs";
	$db_user="kuoch043_cs";
	$db_password="60362cgh";
	
	$dsn="mysql:host=$db_host;dbname=$db_name";
	$db=new PDO($dsn,$db_user,$db_password);
	$user="";
	$user = $_REQUEST['acc'];
	
	set_time_limit(1800);
	
	if(isset($_FILES)){
		$tmp_file_name = $_FILES['file1']['tmp_name'];
		$userfile_name = $_FILES['file1']['name'];
	}
	
	$ext = explode('.',$userfile_name);
	$ext = $ext[count($ext)-1];
	
	if ($ext == 'xls'||$ext == 'xlsx'){
		$objPHPexcel = PHPExcel_IOFactory::load($tmp_file_name);
		$objSheets = $objPHPexcel->getActiveSheet();
		
		if($objSheets  -> getHighestRow()<2){
			
		}
	
		$ErrorMsg = array();
		
		for($introw=1;$introw<= $objSheets -> getHighestRow();$introw++){
			$date = $objSheets -> getCellByColumnAndRow(0,$introw) -> getValue();
			$start_time = $objSheets -> getCellByColumnAndRow(1,$introw) -> getFormattedValue();
			$end_time = $objSheets -> getCellByColumnAndRow(2,$introw) -> getFormattedValue ();;
			
			$date_temp = PHPExcel_Shared_Date::ExcelToPHP( $date ) ;
			$date = date( 'Y-m-d', $date_temp ); 
			
			$ErrorMsgrec = array();
			$ErrorMsgrec['messages'] = "";
			
			if($introw > 1){
				if(!($end_time==='')&&$start_time===''){
					$ErrorMsgrec['row_num'] = str_pad($introw,3,'0',STR_PAD_LEFT);
					$ErrorMsgrec['messages'] = "起始時間未給\r\n";
				}
				if($end_time===''&&!($start_time==='')){
					$ErrorMsgrec['row_num'] = str_pad($introw,3,'0',STR_PAD_LEFT);
					$ErrorMsgrec['messages'] = "結束時間未給\r\n";
				}
				
				
				
				if(!($end_time==='')&&!($start_time==='')){
				/* echo $end_time - $start_time;
				echo "--"; */
				
					if(($end_time - $start_time)<0){
						$ErrorMsgrec['row_num'] = str_pad($introw,3,'0',STR_PAD_LEFT);
						$ErrorMsgrec['messages'] = "結束時間小於起始時間\r\n";
					
					}
					
				}
			
			}
			
			if(count($ErrorMsgrec)>1){
				$ErrorMsg[] = $ErrorMsgrec;
			}
			unset($ErrorMsgrec);
		
		}
		
		if(count($ErrorMsg)>0){
			echo json_encode(array(
				'success' => false,
				'data' => $ErrorMsg,
				'totalCount' => count($ErrorMsg)
			
			));
		
		}
	
		$check_v=0;
		$time_sum = 0;
		for($introw=2;$introw<= $objSheets -> getHighestRow();$introw++){
			$date = $objSheets -> getCellByColumnAndRow(0,$introw) -> getValue();
			$start_time = $objSheets -> getCellByColumnAndRow(1,$introw) -> getFormattedValue();
			$end_time = $objSheets -> getCellByColumnAndRow(2,$introw) -> getFormattedValue();
			
			$date_temp = PHPExcel_Shared_Date::ExcelToPHP( $date ) ;
			$date = date( 'Y-m-d', $date_temp ); 
			
			if(!($end_time==='')&&!($start_time==='')){
				$time_temp = ($end_time - $start_time);
				if(date("w",strtotime($date))==0 || date("w",strtotime($date))==6){
					$time_temp = $time_temp*2;
				}
				$time_sum+=$time_temp;
				
				
				if($time_temp>=0){
					$sql=	"SELECT count(*) as rec_count,
									ok
						FROM `sd_worktime`
						WHERE `account`=?
						and `date`=?";
				
					$sth=$db->prepare($sql);
					$sth->execute(array($user,$date));
					$result=$sth->fetchObject();
					$rec_count = $result->rec_count;
					if($rec_count==0){//do insert
						$sql2=	"INSERT INTO `sd_worktime` ( 
										`account`,
										`date`,
										`start_time`,
										`end_time`,
										`ok`)
								VALUES (?,?,?,?,?)";
								
						$sth2=$db->prepare($sql2);
						$sth2->execute(array($user,$date,$start_time,$end_time,0));	
						$check_v = 1;
					}else{
						if($result->ok==0){
							$sql=	"UPDATE `sd_worktime`
									SET		
											`start_time`=?,	
											`end_time`=?
									WHERE `account`=?
									and `date`=?";
						
							$sth=$db->prepare($sql);
							$sth->execute(array($start_time,$end_time,$user,$date));
							$check_v = 1;
						}else{
						}
					
					
					}
				
				}
			}
			
		}
		if($check_v==1){
			$sql=	"UPDATE `sd_account`
						SET		
								`check_value`=?
						WHERE `account`=?";
			
			$sth=$db->prepare($sql);
			$sth->execute(array($check_v,$user));
			
		}
		
		
		$sql=	"SELECT `permission_id` 
				FROM `sd_account`
				WHERE `account`=?";
		
		$sth=$db->prepare($sql);
		$sth->execute(array($user));
		$result=$sth->fetchObject();
		$per_id = $result->permission_id;
		
		
		$sql2=	"SELECT `money` 
				FROM `sd_permission`
				WHERE `id`=?";
		
		$sth2=$db->prepare($sql2);
		$sth2->execute(array($per_id));
		$result2=$sth2->fetchObject();
		$money_per_hour = $result2->money;
		
		if(count($ErrorMsg)==0)
		echo json_encode(array(
				'success' => true,
				'data' => $ErrorMsg,
				'totalCount' => count($ErrorMsg),
				'salary'=>round($time_sum*$money_per_hour),
				'time_sum'=>round($time_sum)
			
			));
		
	
	
	}
	




?>
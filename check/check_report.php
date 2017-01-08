<?php

	$db_host="dbhome.cs.nctu.edu.tw";
	$db_name="kuoch043_cs";
	$db_user="kuoch043_cs";
	$db_password="60362cgh";
	
	$dsn="mysql:host=$db_host;dbname=$db_name";
	$db=new PDO($dsn,$db_user,$db_password);
	
	if($_REQUEST['action']!=''){
		$function = $_REQUEST['action'];
		$function();
	}

	
	function get_inform(){
		global $db;
		
		$sql=	"SELECT `id`,
						`name`,
						`account`,
						`permission_id`,
						`check_value`
				FROM `sd_account`
				where `permission`>2";
		
		$sth=$db->prepare($sql);
		$sth->execute();
		$result=$sth->fetchAll();
		
		foreach($result as $res_id => $temp){
			$permission_id = $temp["permission_id"];
			$sql2=	"SELECT `position`
					FROM `sd_permission`
					WHERE `id`=? ";
			$sth2=$db->prepare($sql2);
			$sth2->execute(array($permission_id));
			$result2=$sth2->fetchAll();
			foreach($result2 as $res_id2 => $temp2){
				$result[$res_id]["position"] = $temp2["position"]; 
				break;
			}
			if($result[$res_id]["check_value"]==1){
				$result[$res_id]["remark"] = "有差勤資料尚未簽核"; 
			}
			else{
				$result[$res_id]["remark"] = ""; 
			}
		}

		if(is_object($sth)){		
			echo json_encode(array('success'=> true , 'data'=> $result));
		}else{
			echo json_encode(array('success'=> false));
		}
	}
	
	function get_worktime(){
		global $db;
		$account = $_REQUEST['account'];
		$sql=	"SELECT `id`,
						`name`,
						`account`,
						`permission_id`,
						`check_value`
				FROM `sd_account`
				where `account`=?";
		
		$sth=$db->prepare($sql);
		$sth->execute(array($account));
		$result=$sth->fetchAll();
		
		foreach($result as $res_id => $temp){
			if($temp["check_value"]==0){
				echo json_encode(array('success'=> true , 'data'=> ""));
			}
			$permission_id = $temp["permission_id"];
			$sql2=	"SELECT `position`
					FROM `sd_permission`
					WHERE `id`=? ";
			$sth2=$db->prepare($sql2);
			$sth2->execute(array($permission_id));
			$result2=$sth2->fetchAll();
			foreach($result2 as $res_id2 => $temp2){
				$result[$res_id]["position"] = $temp2["position"]; 
				break;
			}
		}
		$sql2=	"SELECT `date`,
						`start_time`,
						`end_time`
				FROM `sd_worktime`
				WHERE `account`=? ";
		$sth2=$db->prepare($sql2);
		$sth2->execute(array($account));
		$result2=$sth2->fetchAll();
		foreach($result2 as $res_id2 => $temp2){
			$result[$res_id2]["date"] = $temp2["date"]; 
			$result[$res_id2]["start_time"] = $temp2["start_time"]; 
			$result[$res_id2]["end_time"] = $temp2["end_time"]; 
		}
		
		if(is_object($sth)){		
			echo json_encode(array('success'=> true , 'data'=> $result));
		}else{
			echo json_encode(array('success'=> false));
		}
	}
	
	function signoff(){
		global $db;
		$account = $_REQUEST['account'];
		$sql=	"UPDATE `sd_account`
				SET		
						`check_value`=0
				WHERE `account`=?";
		
		$sth=$db->prepare($sql);
		$sth->execute(array($account));
		
		if(is_object($sth)){		
			echo json_encode(array('success'=> true ));
		}else{
			echo json_encode(array('success'=> false));
		}
	}

?>
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

	function login(){
		global $db;
		$user=$_REQUEST['account'];
		$password=$_REQUEST['password'];
		$sql=	"SELECT COUNT(*) as login_aut,
						`permission` 
				FROM `sd_account`
				WHERE `account`=?
				AND `password`=?";
		
		$sth=$db->prepare($sql);
		$sth->execute(array($user,$password));
		
		if(is_object($sth)){
			$result=$sth->fetchObject();
			if($result->login_aut==1){
				echo json_encode(array('success'=> true));
			}else{
				echo json_encode(array('success'=> false));
			}
		}else{
			echo json_encode(array('success'=> false));
		}

		
	}
	
	function get_list(){
		global $db;
		$user=$_REQUEST['account'];
		$password=$_REQUEST['password'];
		$sql=	"SELECT COUNT(*) as login_aut,
						`permission` 
				FROM `sd_account`
				WHERE `account`=?
				AND `password`=?";
		
		$sth=$db->prepare($sql);
		$sth->execute(array($user,$password));
		
		if(is_object($sth)){
			$result=$sth->fetchObject();
			if($result->login_aut==1){
				
				$sql1=	"SELECT `link_name` ,`url` ,`remark` 
					FROM `sd_list`
					WHERE `permission`=?";
					
				$sth1=$db->prepare($sql1);
				$sth1->execute(array($result->permission));
				$result1=$sth1->fetchAll();
				
				echo json_encode(array('success'=> true, 'data'=> $result1));
			}else{
				echo json_encode(array('success'=> false));
			}
		}else{
			echo json_encode(array('success'=> false));
		}
	}





?>
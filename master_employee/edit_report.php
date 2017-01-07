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

	function get_position(){
		global $db;
		
		$sql=	"SELECT `position` as position_qq,
						`id`
				FROM `sd_permission`";
		
		$sth=$db->prepare($sql);
		$sth->execute();
		$result=$sth->fetchAll();

		if(is_object($sth)){		
			echo json_encode(array('success'=> true , 'data'=> $result));
		}else{
			echo json_encode(array('success'=> false));
		}

		
	}
	
	function get_inform(){
		global $db;
		
		$sql=	"SELECT `id`,
						`name`,
						`permission`,	
						`account`,
						`password`,
						`permission_id`
				FROM `sd_account`
				where `permission`>1";
		
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
		}

		if(is_object($sth)){		
			echo json_encode(array('success'=> true , 'data'=> $result));
		}else{
			echo json_encode(array('success'=> false));
		}

		
	}
	
	function update_list(){
		global $db;
		
		$data = $_REQUEST['modified'];
		
		$obj = json_decode($data);
		
		foreach($obj as $obj_id => $obj_rec){
			$name = $obj_rec->name;
			$permission = $obj_rec->permission;
			$id = $obj_rec->id;
			$permission_id = $obj_rec->permission_id;
			
			
			$sql=	"UPDATE `sd_account`
					SET		
							`name`=?,	
							`permission`=?,
							`permission_id`=?
					WHERE `id`=?";
			
			$sth=$db->prepare($sql);
			$sth->execute(array($name,$permission,$permission_id,$id));

		}

		if(is_object($sth)){		
			echo "success";
		}

		
		
		
	}

	function insert_list(){
		global $db;
		
		
		$name = isset($_REQUEST['name'])? $_REQUEST['name']:"" ;
		$permission = isset($_REQUEST['permission'])? $_REQUEST['permission']:"" ;
		$password = isset($_REQUEST['password'])? $_REQUEST['password']:"" ;
		$permission_id = isset($_REQUEST['permission_id'])? $_REQUEST['permission_id']:"" ;
		
		
		$sql=	"SELECT max(`id`) as id_max
				FROM `sd_account`";
		
		$sth=$db->prepare($sql);
		$sth->execute();
		$result=$sth->fetchAll();
		
		foreach($result as $res_id => $temp){
			$code = $temp["id_max"]+1;
			break;
		}
		
		$sql=	"INSERT INTO `sd_account` ( 
						`name`,
						`permission`,
						`account`,
						`password`,
						`permission_id`)
				VALUES (?,?,?,?,?)";
		
		$sth=$db->prepare($sql);
		$sth->execute(array($name,$permission,"test".$code,$password,$permission_id));
		 
		if(is_object($sth)){		
			echo json_encode(array('success'=> true ));
		}else{
			echo json_encode(array('success'=> false));
		}
		
	}

	function delete_list(){
		global $db;
		
		$id = isset($_REQUEST['id'])? $_REQUEST['id']:"" ;
	
		$sql=	"DELETE FROM `sd_account`
				WHERE `id`=?";

		$sth=$db->prepare($sql);
		$sth->execute(array($id));
		 
		if(is_object($sth)){		
			echo json_encode(array('success'=> true ));
		}else{
			echo json_encode(array('success'=> false));
		}
		
	}



?>
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
						`position`,
						`money`
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
	
	function update_list(){
		global $db;
		
		$data = $_REQUEST['modified'];
		
		$obj = json_decode($data);
		
		
			foreach($obj as $obj_id => $obj_rec){
				//$code = $obj_rec->code;
				$position = $obj_rec->position;
				$money = $obj_rec->money;
				$id = $obj_rec->id;
							
				$sql=	"UPDATE `sd_permission`
						SET		
								`position`=?,	
								`money`=?
						WHERE `id`=?";
				
				$sth=$db->prepare($sql);
				$sth->execute(array($position,$money,$id));

			}

			if(is_object($sth)){		
				echo "success";
			}
		
		
		
		
	}

	function insert_list(){
		global $db;
		
		//$code = isset($_REQUEST['code'])? $_REQUEST['code']:"" ;
		$position = isset($_REQUEST['position'])? $_REQUEST['position']:"" ;
		$money = isset($_REQUEST['money'])? $_REQUEST['money']:"" ;
		
		$sql=	"INSERT INTO `sd_permission` ( 
						`position`,
						`money`)
				VALUES (?,?)";
		
		$sth=$db->prepare($sql);
		$sth->execute(array($position,$money));
		 
		if(is_object($sth)){		
			echo json_encode(array('success'=> true ));
		}else{
			echo json_encode(array('success'=> false));
		}
		
	}

	function delete_list(){
		global $db;
		
		$id = isset($_REQUEST['id'])? $_REQUEST['id']:"" ;
	
		$sql=	"DELETE FROM `sd_permission`
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
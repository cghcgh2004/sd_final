<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/tr/xhtml1/dtd/xhtml1-transitional.dtd">
<?php
	$db_host="dbhome.cs.nctu.edu.tw";
	$db_name="kuoch043_cs";
	$db_user="kuoch043_cs";
	$db_password="60362cgh";
	
	$dsn="mysql:host=$db_host;dbname=$db_name";
	$db=new PDO($dsn,$db_user,$db_password);
	
 	$user=(isset($_REQUEST['account']))?$_REQUEST['account']:"";
	$password=(isset($_REQUEST['account']))?$_REQUEST['account']:"";
	$sql=	"SELECT `permission` as login_aut
			FROM `sd_account`
			WHERE `account`=?
			AND `password`=?";
	
	$sth=$db->prepare($sql);
	$sth->execute(array($user,$password));
	$result=$sth->fetchObject();
	if($result->login_aut==1){
 
?>
<html xmlns ="http://www.w3.org/1999/xhtml">
	<head profile = "http://qmpq.org/xfn/11" >
		<meta charset="utf-8">
		  
		<link rel="stylesheet" href="../extjs-4.2.1/resources/css/ext-all.css" />
		<script type="text/javascript" src="../extjs-4.2.1/ext-all.js"></script>
			<title>職位及薪資管理系統</title>
			<script ="text/javascript" src="edit.js" ></script>
		  
	  </head>
	<body>
	</body>
</html> 
 <?php
	}else{
		echo "<script>alert('無權限');</script>";
	}
 
?>
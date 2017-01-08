<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/tr/xhtml1/dtd/xhtml1-transitional.dtd">
<?php
	if($_REQUEST['account']!=''){
		echo "<script> acc ='". $_REQUEST['account'] ."';</script>" ;
	}
	
	if($_REQUEST['password']!=''){
		echo "<script> passw ='". $_REQUEST['password'] ."';</script>" ;
	}


?>
<html xmlns ="http://www.w3.org/1999/xhtml">
	<head profile = "http://qmpq.org/xfn/11" >
		<meta charset="utf-8">
		  
		<link rel="stylesheet" href="../extjs-4.2.1/resources/css/ext-all.css" />
		<script type="text/javascript" src="../extjs-4.2.1/ext-all.js"></script>
			<title>薪資線上簽核系統</title>
			<script ="text/javascript" src="cal.js" ></script>
		  
	  </head>
	<body>
		<div id ="upload_form"></div>
		<font size="4"><b><pre><br><br><br><br><br>			注意事項:</pre></b>
			<pre>			1.範例格式:<a href="sample.xlsx">sample</a></pre>
			<pre>			2.請注意所填時間包含起始及結束</pre>
		</font>
	</body>
</html> 
 
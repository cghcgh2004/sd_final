Ext.onReady(function() {

	function openurl(verb,url,data,target){
		var form = document.createElement("form");
		form.action = url;
		form.method = verb;
		form.target = target || "_self";
		if(data){
			for(var key in data){
				var input = document.createElement("textarea");
				input.name = key;
				input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
				form.appendChild(input);
			}
		}
		form.style.display = 'none';
		document.body.appendChild(form);
		form.submit();
	}

	var myStore = Ext.create('Ext.data.Store', {
		fields: [
			{name: 'link_name', 	type: 'string'},
			{name: 'url', 		 	type: 'string',id:'url'},
			{name: 'remark',   type: 'string'}
		],
		proxy: {
			type: 'ajax',
			url: 'aut.php',
			reader: {
				type: 'json',
				root: 'data'
			}
		},
		listeners:{
			beforeload:function(){
				Ext.apply(this.proxy.extraParams,{
					action: 'get_list',
					account: Ext.getCmp('account').getValue(),
					password: Ext.getCmp('password').getValue()
				});
			}
		}/*,
		autoLoad:true*/
	});
	

	var logPanel = Ext.create('Ext.form.Panel', {
		width:300,
		collapsible:true,
		region:'west',
		title: 'Login',
		autoScroll:true,
		frame: true,
		border : false,
		items: [{
			xtype:'textfield',
			width:250,
			fieldLabel:'Id',
			labelAlign: 'right',
			id: 'account',
			margin: '50 0 20 0 ',
			
		},{
			xtype:'textfield',
			width:250,
			fieldLabel:'Password',
			labelAlign: 'right',
			id: 'password',
			inputType: 'password'
			
		}],
		buttons:[{
			text:'Login',
			handler: function(){
				if(Ext.isEmpty(Ext.getCmp('account').getValue())||Ext.isEmpty(Ext.getCmp('password').getValue())){
					Ext.Msg.alert('Notice', 'Your account and password cannot be empty!');
				}
				else{
					logPanel.getForm().submit({
						url: 'aut.php',
						params: {
							action: 'login',
							account: Ext.getCmp('account').getValue(),
							password: Ext.getCmp('password').getValue()
						},
						//check account and password
						success: function(form, action) {
							
							Ext.Msg.alert('Success', 'Hello! '+Ext.getCmp('account').getValue()+'.<br> Welcome!');
							
							//get list
							conPanel.setLoading(true);
							myStore.reload();
							myStore.removeAll();
							conPanel.setLoading(false);
							
						},
						failure: function(form, action) {
							Ext.Msg.alert('Fail', 'Account or password is wrong! <br> Please try again!');
						}
					});
				}
			}
		}]
	}); 
	//logPanel.setPosition(500,0);
var conPanel = Ext.create('Ext.grid.Panel', {
	region:'center',
	border : false,
	autoScroll:true,
	//layout:'fit',
	title: 'Payroll Management System Connection',
	store:myStore,
	emptyText: 'You have not login yet. <br> Please login first!',
	renderTo:Ext.getBody(),
	columns: [{
		text:'程式名稱',
		dataIndex:'link_name',
		width: 200
		
	},{
		text:'備註',
		dataIndex:'remark',
		width: 500
		
	}],
	listeners: {
		itemclick: function(grid, record, tr, rowIndex, e, eOpts) {
			openurl('POST',record.get("url"),{account:Ext.getCmp('account').getValue(),password:Ext.getCmp('password').getValue()},'_blank');
			//window.open(record.get("url"));
		}
	}
}); 
	//conPanel.setPosition(1000,300);
	
	var pict = Ext.create('Ext.panel.Panel', {
		//width :1300,
		height:300,
		region:'north',
		border : false,
		frame:false,
		renderTo:Ext.getBody(),
		html:'<img src="image3.png"></img>'	

	});
	//pict.setPosition(0,0);
	
	/*var downPannel = Ext.create('Ext.panel.Panel', {
		layout: 'border',
		//region:'south',
		items: [logPanel,conPanel]
		
	});*/
	//downPannel.setPosition(1000,300);


		
	/*var pict = Ext.create('Ext.panel.Panel', {
		width :1300,
		height:200,
		border : false,
		frame:false,
		renderTo:Ext.getBody(),*/
		/* autoEl: {      
			tag: 'img',    //指定为img标签      
			src: 'asprova.png'    //指定url路径      
		}  */ 
		/*html:'<img src="images2.jpg"></img>'	

	});
	*/
	//pict.setPosition(300,0);
	Ext.create('Ext.container.Viewport',{
		layout: 'border',
		items: [pict,logPanel,conPanel]
	});


});




Ext.onReady(function() {
     
	var msg_store = new Ext.data.JsonStore({
		pageSize:500,
		remoteFilter :true,
		timeout:30*60*1000,
		autoLoad: false,
		fields:[{
			name:'row_num',
			type:'string'
		
		},{
			name:'messages',
			type:'string'
		
		}]
	
	});
	
	/* var queryGrid = Ext.create('Ext.grid.Panel',{
		columns:[{
			text:'row num',
			dataIndex:'row_num',
			sortable:true,
			width:80,
			align:'center'
		},{
			text:'message',
			dataIndex:'messages',
			sortable:false,
			width:600,
			align:'text-align:center'
		}],
		store:msg_store,
		region:'center'
	
	
	});  */
	
	var querywindow = Ext.create('Ext.window.Window',{
		title:'error message',
		width:500,
		height:300,
		items: {
			xtype:'grid',
			columns:[{
				text:'row num',
				dataIndex:'row_num',
				sortable:true,
				width:80,
				align:'center'
			},{
				text:'message',
				dataIndex:'messages',
				sortable:false,
				width:300,
				align:'text-align:center'
			}],
			store:msg_store,
			region:'center'
		}
	
	});
	 
	var panel = Ext.create('Ext.form.Panel', {
		
		width:400,
		height:150,
		align:'center',
		title: 'upload working time',
		frame: true,
		renderTo:Ext.getBody(),
		items: [{
			xtype:'filefield',
			width:350,
			emptyText: 'Select an excel file',
			fieldLabel: 'file',
			labelAlign: 'right',
			id:'file1',
			name: 'file1',
			margin: '20 0 0 0',
			buttonConfig: {
				iconCls: 'upload-icon'
			}
			
		},{
			xtype:'hiddenfield',
			id:'acc',
			name: 'acc',
			value: acc
			
		}],
		buttons:[{
			text:'Upload',
			handler: function(){
				if(!Ext.isEmpty(Ext.getCmp('file1').getValue())){
					var form = this.up('form').getForm();
					if(form.isValid()){
						form.submit({
							url: 'cal_upload.php',
							timeout:30*60*1000,
							waitMsg: 'updating...',
							success: function(form, action){
								var a = Ext.decode(action.response.responseText);
										
									Ext.Msg.show({
										title:'update success',
										msg:'update success!<br> your slalary of this month is '+a.salary+'<br> hour:'+a.time_sum,
										minWidth:'fit',
										icon:Ext.Msg.INFO,
										buttons:Ext.Msg.OK
									});
	  
							},
							failure:function(form, action){
								var a = Ext.decode(action.response.responseText);
								
									for(var index in a.data){
										a.data[index].messages = a.data[index].messages.replace(/\r\n/g,"<br>");				
									}
									
									msg_store.add(a.data);
									querywindow.show();
									
									Ext.Msg.show({
										title:'error',
										msg:'失敗',
										minWidth:'fit',
										icon:Ext.Msg.INFO,
										buttons:Ext.Msg.OK
									});					
							}
						});
					}
				}
			}
		}]

	}); 
	panel.setPosition(200,20);
	
	var pict = Ext.create('Ext.panel.Panel', {
		//width :1300,
		//height:300,
		border : false,
		frame:false,
		renderTo:Ext.getBody(),
		html:'<img src="image5.jpg"></img>'	

	});
	pict.setPosition(700,-400);
});
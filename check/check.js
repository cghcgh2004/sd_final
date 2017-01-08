
Ext.onReady(function() {

 	
	
	var update_store = Ext.create('Ext.data.Store', {
		fields: [
			{name: 'id', 		type: 'string'},
			{name: 'name', 		type: 'string'},
			{name: 'account', 	type: 'string'},
			{name: 'position', 	type: 'string'},
			{name: 'permission_id',   type: 'string'},
			{name: 'remark',   type: 'string'}
		],
		proxy: {
			type: 'ajax',
			url: 'check_report.php',
			reader: {
				type: 'json',
				root: 'data'
			}
		},
		listeners:{
			beforeload:function(){
				Ext.apply(this.proxy.extraParams,{
					action:'get_inform'
				});
			}
		},
		autoLoad:true
	});

	var search_store = Ext.create('Ext.data.Store', {
		fields: [
			{name: 'id', 		type: 'string'},
			{name: 'name', 		type: 'string'},
			{name: 'account', 	type: 'string'},
			{name: 'position', 	type: 'string'},
			{name: 'permission_id',   type: 'string'},
			{name: 'date',   type: 'string'},
			{name: 'start_time',   type: 'string'},
			{name: 'end_time',   type: 'string'}
		],
		proxy: {
			type: 'ajax',
			url: 'check_report.php',
			reader: {
				type: 'json',
				root: 'data'
			}
		},
		listeners:{
			beforeload:function(){
				Ext.apply(this.proxy.extraParams,{
					action:'get_worktime',
					account: Ext.getCmp('account').getValue()
				});
			}
		}
	});
	
	var check_panel = Ext.create('Ext.grid.Panel', {
	
		align:'center',
		title: '員工資料一覽',
		store:update_store,
		columns: [{
			text:'ID',
			dataIndex:'id'
			
		},{
			text:'姓名',
			dataIndex:'name'
		},{
			text:'帳戶名稱',
			dataIndex:'account'	,
			width: 150
		},{
			text:'職位',
			dataIndex:'position',
			width: 150
		},{
			text:'事項',
			dataIndex:'remark',
			width: 200
		}]
	}); 
	
	var search_panel = Ext.create('Ext.grid.Panel', {
	
		align:'center',
		title: '查詢以及簽核',
		store:search_store,
		emptyText:'No data to show',
		columns: [{
			text:'ID',
			dataIndex:'id'
			
		}, {
			text:'姓名',
			dataIndex:'name'
		},{
			text:'帳戶名稱',
			dataIndex:'account'	,
			width: 150
		},{
			text:'職位',
			dataIndex:'position',
			width: 150
		},{
			text:'日期',
			dataIndex:'date',
			width: 150
		},{
			text:'上班時間',
			dataIndex:'start_time',
			width: 150
		},{
			text:'下班時間',
			dataIndex:'end_time',
			width: 150
		}],
		dockedItems:[{ 
			xtype: 'toolbar', 
			dock: 'top', 
			items: [{
					xtype:'textfield',
					fieldLabel: '*帳戶名稱',
					labelAlign: 'right',
					id :'account',
					margin:'3 0 3 0'
				},{
					xtype:'button',
					text: '查詢',
					scale: 'medium',
					padding: '3 13 3 13',
					margin: '0 0 0 10',
					style:{
						'background-color':'#ECECEC',
						'border': '1px solid blue'
					},
					handler:function(){
						if(!Ext.isEmpty(Ext.getCmp('account').getValue())){
							search_panel.setLoading(true);
							search_store.reload();
							search_store.removeAll();
							search_panel.setLoading(false);
						}else{
							Ext.Msg.alert('','請填寫帳戶名稱!');
						}
					}
				},{
					xtype:'button',
					text: '確認簽核',
					scale: 'medium',
					margin: '0 0 0 10',
					style:{
						'background-color':'#ECECEC',
						'border': '1px solid blue'
					},
					handler:function(){
						if(!Ext.isEmpty(Ext.getCmp('account').getValue())){
							Ext.Ajax.request({
								method:'post',
								url:'check_report.php',
								params:{
									action: 	'signoff',
									account: Ext.getCmp('account').getValue()
								},
								success:function(){
									Ext.Msg.alert('','成功');
									update_store.reload();
									
									search_panel.setLoading(true);
									search_store.reload();
									search_store.removeAll();
									search_panel.setLoading(false);
								},
								failue:function(){
									Ext.Msg.alert('','失敗');
								}
							})
						}else{
							Ext.Msg.alert('','請填寫帳戶名稱!');
						}
							
					}
				}
			] 
		}]
	}); 
	
	
	var tp=Ext.create("Ext.TabPanel",{
        //title:"",
        width:'100%',
        height:600,
        frame:true,
        autoScroll:false,
        defaults:{bodyPadding:10},
        items:[
		  check_panel,
          search_panel
        ],
        renderTo:Ext.getBody()
    });         
	update_store.load();
});






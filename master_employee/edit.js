var permission_store = Ext.create('Ext.data.Store', {
		fields: [
			{name: 'position_qq', 		type: 'string'},
			{name: 'id', 		type: 'string'}
		],
		proxy: {
			type: 'ajax',
			url: 'edit_report.php',
			reader: {
				type: 'json',
				root: 'data'
			},
			extraParams:{
				action:'get_position'
			}
		},
		autoLoad:true
	}); 

Ext.onReady(function() {

 	
	
	var update_store = Ext.create('Ext.data.Store', {
		fields: [
			{name: 'id', 		type: 'string'},
			{name: 'name', 		type: 'string'},
			{name: 'permission',   	type: 'string'},
			{name: 'account', 	type: 'string'},
			{name: 'password', 	type: 'string'},
			{name: 'position', 	type: 'string'},
			{name: 'permission_id',   type: 'string'}
		],
		proxy: {
			type: 'ajax',
			url: 'edit_report.php',
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
    
	var search_panel = Ext.create('Ext.grid.Panel', {
	
		align:'center',
		title: '新增',
		store:update_store,
		
		columns: [ {
			text:'ID',
			dataIndex:'id'
			
		}, {
			text:'姓名',
			dataIndex:'name'
		},{
			text:'帳戶權限',
			dataIndex:'permission'	
		},{
			text:'帳戶名稱',
			dataIndex:'account'	,
			width: 150
		},{
			text:'帳戶密碼',
			dataIndex:'password',
			width: 150
		},{
			text:'職位',
			dataIndex:'position',
			width: 150
		}],
		dockedItems:[{ 
			xtype: 'toolbar', 
			dock: 'top', 
			items: [{
					xtype:'textfield',
					fieldLabel: '*姓名',
					labelAlign: 'right',
					id :'name',
					margin:'3 0 3 0'
				},{
					xtype:'numberfield',
					fieldLabel: '*帳戶權限',
					labelAlign: 'right',
					id :'acc_permission',
					maxValue: 3,
					minValue: 2
				}
			] 
		},{ 
			xtype: 'toolbar', 
			dock: 'top', 
			items: [/* {
					xtype:'textfield',
					fieldLabel: '*帳戶名稱',
					id :'account'
				}, */{
					xtype:'textfield',
					fieldLabel: '*帳戶密碼',
					labelAlign: 'right',
					id :'password',
					margin:'3 0 3 0'
				},{
					xtype:'combo',
					fieldLabel: '職位',
					labelAlign: 'right',
					id :'permission_t',
					store:permission_store,
					displayField:'position_qq',
					valueField:'id'
				}
			] 
		},{ 
			xtype: 'toolbar', 
			dock: 'top', 
			items: [{
					xtype:'button',
					text: '確定新增',
					scale: 'medium',
					padding: '0 20 0 20',
					margin:'0 0 10 420',
					style:{
						'background-color':'#ECECEC',
						'border': '1px solid blue'
					},
					handler:function(){
						if(!Ext.isEmpty(Ext.getCmp('name').getValue())&& !Ext.isEmpty(Ext.getCmp('acc_permission').getValue())
							&& !Ext.isEmpty(Ext.getCmp('password').getValue()) ){
						
								Ext.Ajax.request({
									method:'post',
									url:'edit_report.php',
									params:{
										action: 	'insert_list',
										name:		Ext.getCmp('name').getValue(),
										permission:		Ext.getCmp('acc_permission').getValue(),
										password:		Ext.getCmp('password').getValue(),
										permission_id:		Ext.getCmp('permission_t').getValue()
									},
									success:function(){
										Ext.Msg.alert('','成功');
										update_store.reload();
									},
									failue:function(){
										Ext.Msg.alert('','失敗');
									}
								})	
						}else{
							Ext.Msg.alert('','必選選項需填齊');
						}
					}
				}
			] 
		}]
		
		
		//renderTo:Ext.getBody(),
	}); 
	
	var edit_panel = Ext.create('Ext.grid.Panel', {
	
		align:'center',
		title: '修改',
		store:update_store,
		plugins:[
			Ext.create('Ext.grid.plugin.RowEditing', {
				//clicksToMoveEditor: 1,
				clicksToEdit :1
			})
		],
		columns: [{
			text:'ID',
			dataIndex:'id'
			
		},{
			text:'姓名',
			dataIndex:'name',
			editor: {
                // defaults to textfield if no xtype is supplied
                allowBlank: false
            } 
			
		},{
			text:'帳戶權限',
			dataIndex:'permission',
			editor: {
                // defaults to textfield if no xtype is supplied
                allowBlank: false,
				xtype:'numberfield',
				maxValue: 3,
				minValue: 2
            }	
		},{
			text:'帳戶名稱',
			dataIndex:'account',
			width: 150
			/* editor: {
                // defaults to textfield if no xtype is supplied
                allowBlank: false
            } */	
		},{
			text:'帳戶密碼',
			dataIndex:'password',
			width: 150
			/* editor: {
                // defaults to textfield if no xtype is supplied
                allowBlank: false
            }	 */
		},{
			text:'職位',
			dataIndex:'permission_id',
			width: 150,
			editor: {
                // defaults to textfield if no xtype is supplied
                 xtype:'combo',
				store:permission_store,
				displayField:'position_qq',
				valueField:'id',
				id:'permission_temp'
            },
			renderer:function(value,v,record){
				exist = permission_store.findExact('id',value);
				return permission_store.getAt(exist).get('position_qq'); 
			}
		}],
		dockedItems:[{ 
			xtype: 'toolbar', 
			dock: 'top', 
			/* style:{
				'background':'#ADD8E6'
			},   */
			items: [{
					xtype:'text',
					text:'請直接點擊資料進行修改',
					padding:'10 30 10 10'
					},{
					xtype:'button',
					text:'儲存更新',
					scale: 'medium',
					padding: '0 20 0 20',
					style:{
						'background-color':'#ECECEC',
						'border': '1px solid blue'
					}, 
					handler:function sync(){
						var modify = update_store.getModifiedRecords().slice(0);
						var arr = new Array;
						Ext.each(modify,function(item){
							arr.push(item.data);
						});				
						
						Ext.Ajax.request({
							method:'post',
							url:'edit_report.php',
							params:{
								action: 	'update_list',
								modified:	Ext.JSON.encode(arr)
							},
							success:function(response){
								Ext.Msg.alert("report",response.responseText,
									function(){
										update_store.reload();
									}
								);
							},
							failue:function(){
								Ext.Msg.alert('','失敗')
							}
						})
					}
				}
			]
		}]
	}); 
	
	var delete_panel = Ext.create('Ext.grid.Panel', {
	
		align:'center',
		title: '刪除',
		store:update_store,
		
		columns: [{
			text:'ID',
			dataIndex:'id'
			
		}, {
			text:'姓名',
			dataIndex:'name'
		},{
			text:'帳戶權限',
			dataIndex:'permission'	
		},{
			text:'帳戶名稱',
			dataIndex:'account'	,
			width: 150
		},{
			text:'帳戶密碼',
			dataIndex:'password',
			width: 150
		},{
			text:'職位',
			dataIndex:'position',
			width: 150
		}],
		tbar:[{
			xtype:'text',
			text:'請點擊資料進行刪除',
			padding:'10 0 10 10'
		}],
		listeners: {
			itemclick: function(grid, record, tr, rowIndex, e, eOpts) {
			
				Ext.create('Ext.window.Window', {
					title: '是否刪除此筆資料',
					/* height: 120,
					width: 300, */
					items: [{  
						xtype: 'button',
						text:'是',
						height: 50,
						width: 100,
						handler:function(){
							Ext.Ajax.request({
								method:'post',
								url:'edit_report.php',
								params:{
									action: 	'delete_list',
									id:			record.get('id')
								},
								success:function(){
									Ext.Msg.alert('','成功刪除');
									update_store.reload();
								},
								failue:function(){
									Ext.Msg.alert('','失敗');
								}
							})
							this.up('window').close();
						}
					},{
						xtype: 'button',
						text:'否',
						height: 50,
						width: 100,
						handler:function(){
							this.up('window').close();
						}
					}]
				}).show();
				
			}
		}
	}); 
	
	
	var tp=Ext.create("Ext.TabPanel",{
        //title:"",
        width:'100%',
        height:600,
        frame:true,
        autoScroll:false,
        defaults:{bodyPadding:10},
        items:[
		  edit_panel,
          search_panel,
		  delete_panel
        ],
        renderTo:Ext.getBody()
    });         
	update_store.load();
});






import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [

  {
    id: 1,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    icon: 'ph-gauge',
    link: '/real-estate',
  },


  {
    id: 2,
    label: 'MENUITEMS.APPS.LIST.REALESTATE',
    icon: 'ph-buildings',
    parentId: 2,
    subItems: [
        {
            id: 3,
            label: 'MENUITEMS.APPS.LIST.LISTINGGRID',
            link: '/real-estate/grid',
            parentId: 2
        },
    
        {
            id: 5,
            label: 'MENUITEMS.APPS.LIST.AGENT',
            parentId: 46,
            isCollapsed: true,
            subItems: [
                {
                    id: 52,
                    label: 'MENUITEMS.APPS.LIST.LISTVIEW',
                    link: '/real-estate/agent/list',
                    parentId: 51
                },
            
            ]
        },
        {
            id: 55,
            label: 'MENUITEMS.APPS.LIST.AGENCIES',
            parentId: 46,
            isCollapsed: true,
            subItems: [
                {
                    id: 56,
                    label: 'MENUITEMS.APPS.LIST.LISTVIEW',
                    link: '/real-estate/agencies/list',
                    parentId: 55
                },
               
            ]
        },
     
    ]
},
 
  
  ]

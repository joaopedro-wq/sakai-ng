export interface Button {
    title:string,
    label:string,
    id:string,
    visible:boolean,
    disabled:boolean,
    class:string,
    icon:string,
    routerLink:Array<string>,
    tooltip:string
    loading?:boolean,
} 

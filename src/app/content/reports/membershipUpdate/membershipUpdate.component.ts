import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { CommonWeRequest } from 'src/app/enums/apiRequest';
import {  CouponDetail,SlabdetailServicewise, TransectionResp, WebAppUserProfileResp, WebMemberTypeModel } from 'src/app/enums/apiResponse';
import { RespCode } from 'src/app/enums/emums';
import { ApisessionService } from 'src/app/services/apisession.service';

@Component({
  selector: 'aditya-membershipUpdate',
  templateUrl: './membershipUpdate.component.html',
  styleUrls: ['./membershipUpdate.component.css']
})
export class MembershipUpdateComponent implements OnInit {
  statuscode:number=0;
  msg:string='';
  coupons:CouponDetail[];
  detailsServiceWise:SlabdetailServicewise[];
  webMemberTypeModel:WebMemberTypeModel;
  IsMemberTypeloaded:boolean=false;
  IsMembershipActive:boolean=false;
  IsB2cMembershipRePurchase:boolean=false;
  couponModalView: BsModalRef;
  ServiceModalView: BsModalRef;
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  };
  constructor(private apiSession:ApisessionService,private modalService: BsModalService) {
  }

  ngOnInit() {
    this.GetMemberShipType();
  }
  GetMemberShipType(){
    debugger;
    
    this.apiSession.GetMembershipType().subscribe((resp:WebMemberTypeModel)=>{
      this.webMemberTypeModel=resp;
      this.IsMemberTypeloaded=true;
     
      this.IsB2cMembershipRePurchase=resp.isB2cMembershipRePurchase;
      
      let _this=this;
      if(resp.memberTypes.length>0){
        resp.memberTypes.filter(x=>{
          if(_this.IsMembershipActive==false && x.isIDActive==true)
          _this.IsMembershipActive=true;
        })
      }
    });
  }
  onClickPurchase(id){
    this.statuscode=0;
    this.msg='';
    var _this=this;
    var reqq:CommonWeRequest={
      ID:id,
      StringID:''
    }
    this.apiSession.PurchaseMemberShip(reqq).subscribe((resp:TransectionResp)=>{
      _this.statuscode=resp.statuscode;
      _this.msg=resp.msg;
      if(_this.statuscode==RespCode.Success){
        _this.GetMemberShipType();
      }
    });
  }
 
  onClickGetCoupons(template: TemplateRef<any>){
    this.statuscode=0;
    this.msg='';
    this.couponModalView = this.modalService.show(template,this.config);
    this.couponModalView.setClass('modal-lg');
    this.GetCoupons();
   
  }
  onClickGetSlabCommission(template: TemplateRef<any>,dsw:SlabdetailServicewise[]){
   
    debugger;
    this.statuscode=0;
    this.msg='';
    this.ServiceModalView = this.modalService.show(template,this.config);
    this.ServiceModalView.setClass('modal-md');
    this.detailsServiceWise=dsw;
  
  }

  GetCoupons(){
    var _this=this;
    this.apiSession.GetAllCoupons().subscribe((resp:CouponDetail[])=>{
      _this.coupons=resp;
      if(resp==undefined){
        _this.statuscode=RespCode.Failed;
        _this.msg='No Coupon exists';
      }else if(resp==null){
        _this.statuscode=RespCode.Failed;
        _this.msg='No Coupon exists';
      }if(resp.length==0){
        _this.statuscode=RespCode.Failed;
        _this.msg='No Coupon exists';
      }
    });
  }

  onClickRedeem(couponCode){
    var a="";
    this.statuscode=0;
    this.msg='';
    var _this=this;
    var reqq:CommonWeRequest={
      ID:0,
      StringID:couponCode
    }
    this.apiSession.RedeemCoupon(reqq).subscribe((resp:TransectionResp)=>{
      _this.statuscode=resp.statuscode;
      _this.msg=resp.msg;
      if(_this.statuscode==RespCode.Success){
        _this.GetCoupons();
      }
    });
  }
}

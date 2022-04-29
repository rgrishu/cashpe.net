import { Component, OnInit ,TemplateRef} from '@angular/core';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import {  WebAppUserProfileResp,WebB2cTargetAchieved ,B2cTarget} from 'src/app/enums/apiResponse';
import { ApisessionService } from 'src/app/services/apisession.service';

@Component({
  selector: 'aditya-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  statuscode:number=0;
  msg:string='';
  Target:number;
  Acheive:number;
  Pening:number;

  membertarget:B2cTarget[];
 Name:string;
  OutletName:string;
  EmailID:string;
  Mobile:string;
  AlternateMobile:string;
  DOB:string;
  PAN:string;
  Pincode:string;
  City:string;
  State:string;
  Address:string;
  ServiceModalView: BsModalRef;
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  };
  constructor(private apiSession:ApisessionService,private modalService: BsModalService) {
    this.GetProfile();
    this.GetTarget('true');
  }

  ngOnInit() {
  }
  GetProfile(){ 
    this.apiSession.GetProfile().subscribe((resp:WebAppUserProfileResp)=>{
      if(resp.statuscode==1){
        this.Name=resp.name;
        this.OutletName=resp.outletName;
        this.Mobile=resp.mobileNo;
        this.EmailID=resp.emailID;
        this.AlternateMobile=resp.alternateMobile;
        this.DOB=resp.dob;
        this.PAN=resp.pan;
        this.Pincode=resp.pincode;
        this.City=resp.city;
        this.State=resp.state;
        this.Address=resp.address
      }
    });
    
}
GetTarget(IsTotal:string='true'){ 
  this.apiSession.GetMemberTargetAchieved(IsTotal).subscribe((resp:WebB2cTargetAchieved)=>{
    //console.log(resp.b2cTargetAchieved[0].target)
    if(resp.statuscode==1){
      this.statuscode=resp.statuscode;
      resp.b2cTargetAchieved=resp.b2cTargetAchieved||[];
      this.Target=resp.b2cTargetAchieved[0].target||0;
      this.Acheive=resp.b2cTargetAchieved[0].achieved||0;
      this.Pening=resp.b2cTargetAchieved[0].pending||0;
      this.membertarget=resp.b2cTargetAchieved;
    }
  });
}

onClickGetTarget(template: TemplateRef<any>){
  this.statuscode=0;
    this.msg='';
    this.ServiceModalView = this.modalService.show(template,this.config);
    this.ServiceModalView.setClass('modal-lg');
     this.GetTarget('false');

}
}

import { Component, OnInit } from '@angular/core';
import { APIUrl, RespCode } from '../../enums/emums';
import { ApidataService } from '../../services/apidata.service';
import { ApisessionService } from '../../services/apisession.service';
import { BalanceResp, PGInitiatePGResponse, TransectionResp, } from 'src/app/enums/apiResponse';

@Component({
  selector: 'aditya-paywith-qr',
  templateUrl: './paywith-qr.component.html',
  styleUrls: ['./paywith-qr.component.css']
})
export class PaywithQrComponent implements OnInit {
  QrCode: any ='./assets/img/loader.gif';
  Domain: string = APIUrl.Domain;
  VirtualAccount: string;
  IFSC: string;
  BankName: string;
    balance: number;

  constructor(private apiData: ApidataService, private apiSession: ApisessionService) { }

  ngOnInit() {
    this.PaywithQR()
    this.getWalletbalance()
    this.GettingLastStatusOfPayment()
    /*this.UserVADetail()*/
  }
  PaywithQR() {
    this.apiSession.PayWithQR().subscribe((resp: any) => {
      console.log(resp);

      this.QrCode = URL.createObjectURL(resp);

      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.QrCode = reader.result;
      }, false);

      if (resp) {
        reader.readAsDataURL(resp);
      }
    });
  }

  UserVADetail() {

   
    this.apiSession.UserVADetail().subscribe(resp => {
      console.log(resp);
      if (resp.statuscode==1) {
        if (resp.statuscode != undefined) {
          this.VirtualAccount = resp.res.virtualAccount;
          this.IFSC = resp.res.ifsc;
          this.BankName = resp.res.bankName;
        }
      }
      
    });

  }


  getWalletbalance() {
    
    var BalanceResp: BalanceResp;
    this.apiSession.GetBalance().subscribe(resp => {
      BalanceResp = resp;
      if (BalanceResp.statuscode != undefined) {
        if (BalanceResp.statuscode == RespCode.Success) {
          this.balance = BalanceResp.data.balance;
         
        }
      }
     
    });
  }

  GettingLastStatusOfPayment() {
    let count = 0;
    let pblance = this.balance;
    let _this = this;
    let _st = setInterval(function () {
       count = count + 1;
      _this.getWalletbalance();
      if (pblance <_this.balance || count>42)
      {
        clearInterval(_st);
        window.location.reload();

      }
      console.log(count);
    }, 10 * 1000);
  }
}

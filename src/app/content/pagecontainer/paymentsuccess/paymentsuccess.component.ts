import { Component, OnInit } from '@angular/core';
import { SessionVar, RespTranCode } from 'src/app/enums/emums';
import { ApidataService } from 'src/app/services/apidata.service';
import * as moment from 'moment';

@Component({
  selector: 'aditya-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.css']
})
export class PaymentsuccessComponent implements OnInit {

  data = {
    "TransactionID": "",
    "Date": "",
    "Mode": "",
    "Status": "",
    "Mobile": "",
    "Amount": ""
  }
  MobileRecharge: string = 'Mobile Recharge'
  RechargeSuccessful: string = 'Recharge Successful';
  constructor(private apiData: ApidataService) { }

  ngOnInit() {
    this.getData()
  }

  getData() {
    debugger
    var req = this.apiData.getSessionData(SessionVar.TransactionRequest);
    var resp = this.apiData.getSessionData(SessionVar.TransactionResponse);
    if (req) {

      this.data = {
        Amount: req.amount,
        Date: moment(new Date()).format("DD MMM YYYY"),
        Mobile: req.accountNo,
        Mode: 'Wallet',
        Status: resp.statuscode == RespTranCode.Success ? 'Success' : 'Pending',
        TransactionID: resp.transactionID
      }
      this.MobileRecharge = req.subject == undefined ? 'Mobile Recharge' : 'Upi Payment';
      this.RechargeSuccessful = req.subject == undefined ? this.RechargeSuccessful : 'Upi Payment Successful';
    }
    else {

    }
    if (resp.statuscode == RespTranCode.Success) {
      this.apiData.getBalance();
    }


  }

}

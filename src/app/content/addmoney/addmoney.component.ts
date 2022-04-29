import { Component, OnInit, TemplateRef,Renderer2,Inject, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import {DOCUMENT} from '@angular/common';
import { ApidataService } from 'src/app/services/apidata.service';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { BalanceResp, PGInitiatePGResponse, TransectionResp, } from 'src/app/enums/apiResponse';
import { ApiService } from 'src/app/services/apiservices.service';
import { ApisessionService } from 'src/app/services/apisession.service';
import { RespCode,SessionVar,APIUrl,HeaderInfo, PGType, RespTranCode} from 'src/app/enums/emums';
import { NumberListResp, OpTypeResp } from 'src/app/enums/apiResponse';
import { FormGroup,FormBuilder,Validators} from '@angular/forms'
import { FormValidationService } from 'src/app/services/form-validation.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'
import { PGStatusCheckRequestModel, PGWebRequestModel, TransactionReq } from 'src/app/enums/apiRequest';
import { ActionComponent } from '../pagecontainer/action/action.component';
import { TimerComponent } from 'src/app/content/timer/timer.component';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'aditya-addmoney',
  templateUrl: './addmoney.component.html',
  
  styleUrls: ['./addmoney.component.css'],
  
})

export class AddmoneyComponent implements OnInit {
  
  IsPaymentButtonShow = false;
  IsVPA: Boolean = false;
  PaymodeID: number = 0;
  ImageURL: String = APIUrl.Domain + 'Image/operator/';
  BaseData: NumberListResp;
  OpTypes: OpTypeResp;
  Domain: string = APIUrl.Domain;
  balance = 0;
  gettingBalanceSpinClass = "fa fa-refresh";
  operatorlist = [];
  addMoneyView: BsModalRef;
  quickViewData: any;
  AmountCharged: any;
  ChargedPer: number = 0;
  config = {
    keyboard: false,
    ignoreBackdropClick: true,
    class: 'cus-modal'
  };
  ChargeAmtType: boolean;
  errorMsg = '';
  response: TransectionResp;
  request1: TransactionReq = {
    accountNo: 0,
    amount: 0,
    customerNo: '',
    geoCode: '',
    o1: '',
    o2: '',
    o3: '',
    o4: '',
    oid: 0,
    refID: ''
  };
  IsICICUpi: boolean = false;
  Paymentoperators = [];
 
  selectedWallet:number=1;
  AdmoneyForm: FormGroup;
  @Input() amount: number = 0;
  @Input() IsRechargeReq: number = 0;
  @Output() actionEvent = new EventEmitter();
  stratimerc: number = 0;
  vpa: string = '';
  TID: number = 0;
  UPIName = { apl: "Amazon Pay App", allbank: "BHIM ALLBANK UPI", axisbank: "Axis Pay", axl: "Phone-Pe", BARODAMPAY: "Baroda Pay", citi: "Citi Mobile APP", citigold: "Citi Mobile APP", dbs: "DigiBank - DBS APP", federal: "BHIM Lotza UPI", freecharge: "Freecharge", hsbc: "HSBC Simply Pay", ibl: "Phone-Pe", icici: "iMobile - ICICI Bank", idfcfirst: "IDFC First", indus: "IndusPay", kotak: "Kotak Mobile Banking App", okaxis: "Google Pay", okhdfcbank: "Google Pay", okicici: "Google Pay", oksbi: "Google Pay", paytm: "Paytm App", rbl: "RBL Pay", sbi: "SBIPay", sib: "SIB Mirror", upi: "BHIM APP", ybl: "Phone-Pe", yesbank: "YES PAY" };
  upiImg: string;
  PGStatus: number = 0;
  IsErrorInValidation: boolean = false;
  ErrorMsg: string = '';
  showQrCode: boolean = false;
  btntext:string='Pay With Qr'
 myWindow: Window;
    UPINamedis: any;
  constructor(private apiData: ApidataService, private router: Router,
    private modalService: BsModalService,
    private apiSession: ApisessionService, private fb: FormBuilder,
    private FormValidation: FormValidationService,
    private auth: AuthService, private _rend2: Renderer2
    , @Inject(DOCUMENT) private _document: Document, private timer: TimerComponent) {
    

  }
  ngOnInit() {
    this.AmountCharged = this.amount;
    this.getPaymentMode();
   
    var isLocal = localStorage.getItem(SessionVar.BaseData);
    if (isLocal) {
      this.BaseData = JSON.parse(localStorage.getItem(SessionVar.BaseData));
      this.apiData.setSessionData(SessionVar.BaseData, this.BaseData);
      this.OpTypes = JSON.parse(localStorage.getItem(SessionVar.OperatorList));
      this.apiData.setSessionData(SessionVar.OperatorList, this.OpTypes);
    }
    this.operatorlist = this.apiData.getAddmoneyOperator();
    this.getWalletbalance();
   
    this.AdmoneyForm = this.fb.group({
      amount: this.fb.control('', [Validators.required]),
      vpa: this.fb.control(''),
      myControl: this.fb.control('')
     
    });
    
  }
  radioCheckedChange(id,ac,spkey='',cat) {
    this.ChargedPer = ac;
    this.ChargeAmtType = cat;
    this.IsPaymentButtonShow = true;
    this.PaymodeID = id;

    /* if (id == 252 || id == 396)*/
    if (spkey =='UPIICI')
    {
      this.IsVPA = true;
    } else {
      this.IsVPA = false;
    }
    this.changeAmountCharged();
  }
  changeAmountCharged() {
    if (this.amount < 1) {
      this.amount = 0;
    }
    if (this.amount > 0 && this.ChargeAmtType==false)
      this.AmountCharged = (this.amount + (this.amount * this.ChargedPer / 100)).toFixed(2);
    else
      this.AmountCharged = this.amount.toFixed(2) + this.ChargedPer;

  }
  getWalletbalance() {
    this.gettingBalanceSpinClass = "fa fa-refresh fa-spin";
    var BalanceResp: BalanceResp;
    this.apiSession.GetBalance().subscribe(resp => {
      BalanceResp = resp;
      if (BalanceResp.statuscode != undefined) {
        if (BalanceResp.statuscode == RespCode.Success) {
          this.balance = BalanceResp.data.balance;
          if (this.IsRechargeReq == 1) {
            this.PGStatus = 4;
            this.Startrecharge();
          }
          else {
            this.reloadWindow();
          }
        }
      }
      this.gettingBalanceSpinClass = "fa fa-refresh";
    });
  }
  getPaymentMode() {
   
    var NumberListResp: NumberListResp;
    this.apiSession.GetPaymentMode().subscribe(resp => {
      NumberListResp = resp;
      if (NumberListResp.statuscode != undefined) {
        if (NumberListResp.statuscode == RespCode.Success) {
          this.Paymentoperators = NumberListResp.data.operators;
          
        }
      }
    });
  }
 
  openQuickVIewPopup(template: TemplateRef<any>) {
    this.addMoneyView = this.modalService.show(template, this.config);
    this.addMoneyView.setClass('addmoney-popup modal-sm');
  }
  closeQuickVIewPopup() {
   
    this.addMoneyView.hide();
    if (this.PGStatus == 3) {
      if(this.myWindow != undefined)
      this.myWindow.close();
      window.location.reload();
    } else {
      this.TID = 0;
      this.PGStatus = 0;
      this.IsICICUpi = false;
    }

  }
  callchild() {
    this.timer.startimer();
  }

  proceedToPay() {
    this.stratimerc=1
   
    this.IsErrorInValidation = false;
    this.IsPaymentButtonShow = false;
    if (this.amount < 1) {
      this.IsPaymentButtonShow = true;
      this.IsErrorInValidation = true;
      this.ErrorMsg = 'Invalid Amount';
      return;
    }
    if (this.PaymodeID == 252||this.PaymodeID==396) {
   if (this.vpa == '') {
    this.IsPaymentButtonShow = true;
    this.IsErrorInValidation = true;
      this.ErrorMsg = 'Invalid VPA';
     return;
    }
    }
   
    var req: PGWebRequestModel = { a: this.AmountCharged, id: this.PaymodeID, vpa: this.vpa, w: 1 }
    this.apiSession.GetPGDetail(req).subscribe((resp: PGInitiatePGResponse) => {
      if (resp.statuscode == 1) {
        if (resp.pGModelForWeb != undefined ) {
          this.TID = resp.pGModelForWeb.tid;

          if (resp.pGModelForWeb.pgType == PGType.PAYTMJS) {
            this.PaytmJSwindowopen(resp.pGModelForWeb.url, resp.pGModelForWeb.paytmJSRequest.mid, resp.pGModelForWeb.paytmJSRequest.token, resp.pGModelForWeb.paytmJSRequest.orderID, resp.pGModelForWeb.paytmJSRequest.amount, resp.pGModelForWeb.paytmJSRequest.payMode);
            //this.DrawPaytmJS(resp.pGModelForWeb.url, resp.pGModelForWeb.paytmJSRequest.mid, resp.pGModelForWeb.paytmJSRequest.token, resp.pGModelForWeb.paytmJSRequest.orderID, resp.pGModelForWeb.paytmJSRequest.amount, resp.pGModelForWeb.paytmJSRequest.payMode);

          }
          else if (resp.pGModelForWeb.pgType == PGType.RAZORPAY) {
            this.DrawRazorpayJS(resp.pGModelForWeb.rPayRequest.callback_url, resp.pGModelForWeb.rPayRequest.key_id, resp.pGModelForWeb.rPayRequest.amount, resp.pGModelForWeb.rPayRequest.order_id, resp.pGModelForWeb.rPayRequest.name, resp.pGModelForWeb.rPayRequest.image, resp.pGModelForWeb.rPayRequest.prefill_name, resp.pGModelForWeb.rPayRequest.prefill_email, resp.pGModelForWeb.rPayRequest.prefill_contact);
          }
          else if (resp.pGModelForWeb.pgType == PGType.PayU) {

          }
          else if (resp.pGModelForWeb.pgType == PGType.AggrePay) {

          }
          else if (resp.pGModelForWeb.pgType == PGType.ICICIUPI) {
           
            this.DrawICICIUPI();
          }
        }
      }
    


      else {
        this.IsErrorInValidation = true;
        this.ErrorMsg = resp.msg;
      }
    });
  }
  GettingLastStatusOfPayment() {
    var count = 0;
    this.PaymodeID = 0;
    let _this = this;
    let _st = setInterval(function ()
    {
      var ReqPGStatus: PGStatusCheckRequestModel = {
        OrderID: _this.TID,
        IsICICUpi: _this.IsICICUpi
      }
      if (_this.TID == 0)
      {
        clearInterval(_st);
        return;
      }
      _this.apiSession.CheckPGStatus(ReqPGStatus).subscribe((resp: PGInitiatePGResponse) => {
       
        if (resp.statuscode == 1) {
         
          if (resp.status == 2) {
            _this.PGStatus = 2;
            clearInterval(_st);
            IsICICUpi: false;
            _this.getWalletbalance();
            setTimeout(function ()
            {
              _this.TID = 0;
            }, 2000);
            //Success
          }
          else if (resp.status == 3) {
            //failed
            _this.PGStatus = 3;
            this.IsICICUpi = false;
             clearInterval(_st);
            setTimeout(function () {
              _this.TID = 0;

            }, 2000);
          } else {
            _this.PGStatus = 1;
          }
        } else {
          _this.PGStatus = 3;
           clearInterval(_st);
          setTimeout(function ()
          {
            _this.TID = 0;
          }, 2000);
        }

      });
    }, 10 * 1000);
  }
  DrawPaytmJS(PTMBaseURL, MID, token, orderid, amount, PayMode) {
   
    let scriptBody = this._rend2.createElement('script');
    scriptBody.text = `function onScriptLoad() {
      let payTMJSconfig = {
      "root": "",
      "style": {
          "bodyColor": "#cccc33",
          "themeBackgroundColor": "",
          "themeColor": "",
          "headerBackgroundColor": "",
          "headerColor": "#5933cc",
          "errorColor": "",
          "successColor": ""
      },
      "flow": "DEFAULT",
      "data": {
          "orderId": '${orderid}',
          "token": '${token}',
          "tokenType": "TXN_TOKEN",
          "amount": '${amount}',
          "userDetail": {
              "mobileNumber": "",
              "name": ""
          }
      },
      "merchant": {
          "mid": '${MID}',
          "name": "",
          "redirect": true
      },
      "labels": {},
      "payMode": {
          "labels": {},
          "filter": [],
          "order": ['${PayMode}']
      },
      "handler": {
          notifyMerchant: function (eventType, data) {
              console.log("notifyMerchant handler function called");
              console.log("eventType => ", eventType);
              console.log("data => ", data);
              if (eventType == 'APP_CLOSED') {
                  window.close();
              }
          }
      }
      };
      if (window.Paytm && window.Paytm.CheckoutJS) {
          window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
              window.Paytm.CheckoutJS.init(payTMJSconfig).then(function onSuccess() {
                  window.Paytm.CheckoutJS.invoke();
              }).catch(function onError(error) {
                  console.log("error => ", error);
              });
          });
      }
  }`;
    this._rend2.appendChild(this._document.body, scriptBody);
    let scriptPTM = this._rend2.createElement('script');
    scriptPTM.type = 'application/javascript';
    scriptPTM.setAttribute('onload', 'onScriptLoad()');
    scriptPTM.setAttribute('crossorigin', 'anonymous');
    scriptPTM.src = `${PTMBaseURL}merchantpgpui/checkoutjs/merchants/${MID}.js`;
    this._rend2.appendChild(this._document.body, scriptPTM);
    let _this = this;
    this.PGStatus = 1;
    setTimeout(function () {
      _this.GettingLastStatusOfPayment();
    }, 1 * 60 * 1000);
  }
  DrawRazorpayJS(callbackURL, key_id, amount, order_id, name, image, Prefill_name, Prefill_email, Prefill_contact) {
    let formElem = this._rend2.createElement('form');
    formElem.setAttribute('action', callbackURL);
    formElem.setAttribute('method', 'POST');
    let scriptElem = this._rend2.createElement('script');
    scriptElem.src = 'https://checkout.razorpay.com/v1/checkout.js';
    scriptElem.setAttribute('data-key', key_id);
    scriptElem.setAttribute('data-amount', amount);
    scriptElem.setAttribute('data-currency', 'INR');
    scriptElem.setAttribute('data-order_id', order_id);
    scriptElem.setAttribute('data-buttontext', 'Pay With Razorpay');
    scriptElem.setAttribute('data-name', name);
    scriptElem.setAttribute('data-description', 'transaction');
    scriptElem.setAttribute('data-image', image);
    scriptElem.setAttribute('data-prefill.name', Prefill_name);
    scriptElem.setAttribute('data-prefill.email', Prefill_email);
    scriptElem.setAttribute('data-prefill.contact', Prefill_contact);
    scriptElem.setAttribute('data-theme.color', '#F37254');

    formElem.appendChild(scriptElem);
    var script2 = this._rend2.createElement('script');
    script2.text = `setTimeout(function () {
      try {
          var ctrl = document.getElementsByClassName('razorpay-payment-button')[0];
          if (ctrl != undefined) {
              ctrl.click();
              ctrl.remove();
          }
      } catch (err) { }

  }, 500);`;
    formElem.appendChild(script2);
    this._rend2.appendChild(this._document.body, formElem);
    let _this = this;
    this.PGStatus = 1;
    setTimeout(function () {
      _this.GettingLastStatusOfPayment();
    }, 1 * 60 * 1000);
  }

  PaytmJSwindowopen(PTMBaseURL, MID, token, orderid, amount, PayMode) {
    var stxt = `<html><head><title>Merchant Checkout Page</title></head><body> <center><h1>Please do not refresh this page...</h1></center><script> function onScriptLoad() {
      let payTMJSconfig = {
      "root": "",
      "style": {
          "bodyColor": "#cccc33",
          "themeBackgroundColor": "",
          "themeColor": "",
          "headerBackgroundColor": "",
          "headerColor": "#5933cc",
          "errorColor": "",
          "successColor": ""
      },
      "flow": "DEFAULT",
      "data": {
          "orderId": '${orderid}',
          "token": '${token}',
          "tokenType": "TXN_TOKEN",
          "amount": '${amount}',
          "userDetail": {
              "mobileNumber": "",
              "name": ""
          }
      },
      "merchant": {
          "mid": '${MID}',
          "name": "",
          "redirect": true
      },
      "labels": {},
      "payMode": {
          "labels": {},
          "filter": [],
          "order": ['${PayMode}']
      },
      "handler": {
          notifyMerchant: function (eventType, data) {
              console.log("notifyMerchant handler function called");
              console.log("eventType => ", eventType);
              console.log("data => ", data);
              if (eventType == 'APP_CLOSED') {
                  window.close();
              }
          }
      }
      };
      if (window.Paytm && window.Paytm.CheckoutJS) {
          window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
              window.Paytm.CheckoutJS.init(payTMJSconfig).then(function onSuccess() {
                  window.Paytm.CheckoutJS.invoke();
              }).catch(function onError(error) {
                  console.log("error => ", error);
              });
          });
      }
  } </script>
<script type="application/javascript" onload = "onScriptLoad();" crossorigin = "anonymous" src = "${PTMBaseURL}merchantpgpui/checkoutjs/merchants/${MID}).js" > </script>
</body></html>`;
    let _this = this;
    this.PGStatus = 1;
    setTimeout(function () {
      _this.GettingLastStatusOfPayment();
    }, 1*60* 1000);
      this.myWindow = window.open("/", "_blank", "width=900,height=650");
    this.myWindow.document.write(stxt);
    this.myWindow.addEventListener("beforeunload", function (e) {
      _this.GettingLastStatusOfPayment();
    }, false);
    
   
  }

  Startrecharge() {
     if (this.IsRechargeReq == 1)
      this.request1 = this.apiData.getSessionData(SessionVar.TransactionRequest);
    if (this.IsRechargeReq == 1 && this.balance >= this.request1.amount)
    {
      this.addMoneyView.hide();
      this.TID = 0;
      this.PGStatus = 0;
      this.actionEvent.emit();
    }
  }
  reloadWindow(a=0) {
    this.PGStatus=a==0?1:3;
    this.IsICICUpi = false;
    if (this.myWindow != undefined)
    this.myWindow.close();
    //window.location.reload();
  }

  DrawICICIUPI() {
    this.addMoneyView.setClass('addmoney-popup modal-md');
    this.IsICICUpi = true;
    this.upiImg = this.vpa.split('@').length > 1 ? this.vpa.split('@')[1] : 'upi';
   this.UPINamedis = this.UPIName[this.UPIName.hasOwnProperty(this.upiImg) == false ? 'upi' : this.upiImg];
    let _this = this;
    this.PGStatus = 1;
    setTimeout(function () {
      _this.GettingLastStatusOfPayment();
    }, 1 * 10 * 1000);
 
  }

  PaywithQR()
  {
    this.showQrCode = !this.showQrCode;
    this.btntext = this.showQrCode ? 'Pay With Qr' : 'Pay with UPIID'
    this.PaymodeID = 0;
  }
  

  
}




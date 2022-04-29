
export enum SessionVar
{
   BaseData='basedataV1.0',
   OperatorList='optypeV1.0',
   ROffer='ROfferV1.0',
   DthInfo='dthinfoV1.0',
   LoginInfo='logininfo',
   SessionID='7B5E8172C476ECEC4D8C56D1CD677751',
   Session='9577FBAC4F1F7A09DC0273D7F2CCC47B',
   UserName='3F53566D13CA4639615586CB256AC3A9',
   UserID='84999DDF3A9C2E01E4FE79D942D3B872',
   OTP='otp',
   TransactionRequest='tranreq',
   TransactionResponse='tranresp'
}

export enum LocalVar
{

}
export enum menus
{
    M15='DMR Charge'
}
export enum RespCode
{
    Success=1,
    Failed=-1,
    otp=2
}
export enum RespTranCode
{
    Pending=1,
    Success=2,
    Failed=3,
    Refund=4
}
export enum APIUrl {
    GetOpTypes = 'GetOpTypes',
    Login = 'Login',
    SignUp = 'Signup',
    VarifyOTP = 'ValidateOTP',
    GetNumberList = 'GetNumberList',
    GetCompanyProfile = 'GetCompanyProfile',
    UserSubscriptionApp = 'UserSubscriptionApp',
    SimplePlan = 'simpleplan',
    ROffer = 'roffer',
    DTHCustomerInfo = 'dthcustomerinfo',
    DTHSimplePlanInfo = 'DTHSimplePlanInfo',
    GetBalance = 'GetBalance',
    GetPGDetail = 'GetPGDetail',
    CheckPGStatus = 'CheckPGStatus',
    Transaction = 'transaction',
    GetProfile = 'GetProfile',
    GetMembershipType = 'GetMembershipType',
    GetB2cTargetAchieved = 'GetB2cTargetAchieved',
    PurchaseMemberShip = 'PurchaseMemberShip',
    RedeemCoupon = 'RedeemCoupon',
    GetAllCoupons = 'GetAllCoupons',
    FetchBill = 'FetchBill',
    RechargeReport = 'RechargeReport',
    LedgerReport = 'LedgerReport',
    RefundRequest = 'RefundRequest',
    Logout = 'logout',
    test = "Get",
    CheckNumberSeries = "CheckNumberSeries",
    CheckIsLookUpFromAPI = "CheckIsLookUpFromAPI",
    GetBanner = "GetBanner",
    ForgetPassword = "ForgetPassword",
    GetPaymentMode = 'GetPaymentMode',
    GetUserInfo = 'GetUserInfo',
    WalletToWalleTransfer = 'WalletToWalletTransfer',
    UpdateProfile = 'UpdateProfile',
    UploadAdvertisement = 'UploadAdvertisement',
    GetAdvertisementPackage = 'GetAdvertisementPackage',
    GetAdvertisementList = 'GetAdvertisementList',
  GetAdvertisementListFooter = 'GetAdvertisementListFooter',
  UserVADetail = "UserVADetail",
  PayWithQR = "PayWithQR",
  PostUpiPayment = 'DoUPIPaymentB2C',
  B2COpDetail = 'B2COpDetail',
  B2COpOptional = 'B2COpOptional',
   // Domain='http://localhost:54343/',
   // BaseURL = 'http://localhost:54343/WebApp/'
   Domain = 'https://pay2raj.in/',
    BaseURL = 'https://pay2raj.in/WebApp/'
    
}
export enum HeaderInfo{
    Domain="pay2raj.in",
     //Domain="85.10.235.153",
    AppID="6072874e1f4b7000991915fa914318ed",
    Version="1.0",
    Title="Cashpay"
}
export enum OpTypes{
    Prepaid=1,
    PostPaid=2,
    DTH=3,
    Landline=4,
    Electricity=5,
    PipedGas=6,
    Broadband=16,
    EducationFees=47,
    HousingSociety=48,
    Subscription=54,
    MunicipalTaxes=46,
    ClubsandAssociations=64,
    BARAssociationFee=69,
    Hospital=52,
    Water=17,
    Gas=26,
    CableTV=39,
    Insurance=27,
    AddMoney = 37,
      UPI = 50,
  Advertisement = 83,
  UpiPayment = 62,
  FASTag=38
}
export enum ThemeType
{
    Old=1,
    New=2
}

export enum PGType{
    PAYTM=1,
    RAZORPAY=2,
    ICICIUPI=3,
    AggrePay=4,
    UPIGATEWAY=5,
    PayU=6,
    PAYTMJS=7
}

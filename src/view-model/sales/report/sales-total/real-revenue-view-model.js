import ViewModel  from '../../../view-model.js'
export default class RealRevenueViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      sales: {
        service_sales: {
          quantity: 0,
          amount  : 0
        },
        service_refund: {
          quantity: 0,
          amount  : 0
        },
        product_sales: {
          quantity: 0,
          amount  : 0
        },
        product_refund: {
          quantity: 0,
          amount  : 0
        },
        all_sales: {
          quantity: 0,
          amount  : 0
        },
        all_refund: {
          quantity: 0,
          amount  : 0
        }
      },
      balance_deduction: {
        service: {
          quantity: 0,
          amount  : 0
        },
        product: {
          quantity: 0,
          amount  : 0
        },
        all: {
          quantity: 0,
          amount  : 0
        },
      },
      service_deduction: {
        service: {
          quantity: 0,
          amount  : 0
        },
        product: {
          quantity: 0,
          amount  : 0
        },
        all: {
          quantity: 0,
          amount  : 0
        },
      },
      total: {
        service: 0,
        product: 0,
        all    : 0
      },
      number_of_sales: {
        service: 0,
        product: 0,
        all    : 0
      },
      price_per_sales: {
        service: 0,
        product: 0,
        all    : 0
      }
    }
  }
  
  mapFieldsFromApi(api_data){
    this.fields.sales             = this.mapValueSalesFromApi(api_data.sales)
    this.fields.balance_deduction = this.mapValueDeductionFromApi(api_data.balanceDeduction)
    this.fields.service_deduction = this.mapValueDeductionFromApi(api_data.serviceDeduction)
    this.fields.total             = this.mapValueTotalFromApi()
    this.fields.number_of_sales   = this.mapValueNumberOfSalesFromApi(api_data)
    this.fields.price_per_sales   = this.mapValuePricePerSalesFromApi()
  }
  mapValueSalesFromApi(sales){
    let tmp_all_sales = {
      quantity: sales.serviceSales.quantity + sales.productSales.quantity,
      amount  : sales.serviceSales.amount   + sales.productSales.amount
    }
    let tmp_all_refund = {
      quantity: sales.serviceRefund.quantity + sales.productRefund.quantity,
      amount  : sales.serviceRefund.amount   + sales.productRefund.amount
    }
    return {
      service_sales : this.mapValueFromApi(sales.serviceSales),
      service_refund: this.mapValueFromApi(sales.serviceRefund),
      product_sales : this.mapValueFromApi(sales.productSales),
      product_refund: this.mapValueFromApi(sales.productRefund),
      all_sales     : this.mapValueFromApi(tmp_all_sales),
      all_refund    : this.mapValueFromApi(tmp_all_refund),
      total         : {
        quantity: tmp_all_sales.quantity + tmp_all_refund.quantity,
        amount  : tmp_all_sales.amount + tmp_all_refund.amount,
      }
    }
  }
  mapValueDeductionFromApi(deduction){
    let tmp_deduction_all = {
      quantity: deduction.serviceSales.quantity + deduction.productSales.quantity,
      amount  : deduction.serviceSales.amount   + deduction.productSales.amount
    }
    return {
      service: this.mapValueFromApi(deduction.serviceSales),
      product: this.mapValueFromApi(deduction.productSales),
      all    : this.mapValueFromApi(tmp_deduction_all)
    }
  }
  mapValueTotalFromApi(){
    let tmp_service_total = this.fields.sales.service_sales.amount  + this.fields.balance_deduction.service.amount 
                           +this.fields.sales.service_refund.amount + this.fields.service_deduction.service.amount
    let tmp_product_total = this.fields.sales.product_sales.amount  + this.fields.balance_deduction.product.amount
                           +this.fields.sales.product_refund.amount + this.fields.service_deduction.product.amount
    let tmp_all_total     = this.fields.sales.all_sales.amount  + this.fields.balance_deduction.all.amount
                           +this.fields.sales.all_refund.amount + this.fields.service_deduction.all.amount
    return {
      service: tmp_service_total,
      product: tmp_product_total,
      all    : tmp_all_total
    }
  }
  mapValueNumberOfSalesFromApi(api_data){
    return {
      service: api_data.numberOfSalesService,
      product: api_data.numberOfSalesProduct,
      all    : api_data.numberOfSalesService + api_data.numberOfSalesProduct
    }
  }
  mapValuePricePerSalesFromApi(){
    let tmp_service_price = 0
    let tmp_product_price = 0
    let tmp_all_price = 0
    if(this.fields.number_of_sales.service > 0)
      tmp_service_price = this.fields.total.service / this.fields.number_of_sales.service
    if(this.fields.number_of_sales.product > 0)
      tmp_product_price = this.fields.total.product / this.fields.number_of_sales.product
    if(this.fields.number_of_sales.all > 0)
      tmp_all_price = this.fields.total.all / this.fields.number_of_sales.all
    return {
      service: tmp_service_price,
      product: tmp_product_price,
      all    : tmp_all_price
    }
  }
  mapValueFromApi(api_data){
    return {
      quantity : api_data.quantity,
      amount   : api_data.amount
    }
  }
}
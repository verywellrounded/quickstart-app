export interface MindeeResponse {
  api_request: ApiRequest;
  document: Document;
}

export interface ApiRequest {
  error: Error;
  resources: string[];
  status: string;
  status_code: number;
  url: string;
}

export interface Error {}

export interface Document {
  annotations: Annotations;
  id: string;
  inference: Inference;
  n_pages: number;
  name: string;
  ocr: Ocr;
}

export interface Annotations {
  labels: any[];
}

export interface Inference {
  extras: Extras;
  finished_at: string;
  pages: Page[];
  prediction: Prediction2;
  processing_time: number;
  product: Product;
  started_at: string;
}

export interface Extras {}

export interface Page {
  extras: Extras2;
  id: number;
  prediction: Prediction;
}

export interface Extras2 {}

export interface Prediction {
  category: Category;
  date: Date;
  document_type: DocumentType;
  line_items: LineItem[];
  locale: Locale;
  orientation: Orientation;
  subcategory: Subcategory;
  supplier_address: SupplierAddress;
  supplier_company_registrations: SupplierCompanyRegistration[];
  supplier_name: SupplierName;
  supplier_phone_number: SupplierPhoneNumber;
  taxes: Tax[];
  time: Time;
  tip: Tip;
  total_amount: TotalAmount;
  total_net: TotalNet;
  total_tax: TotalTax;
}

export interface Category {
  confidence: number;
  value: string;
}

export interface Date {
  confidence: number;
  polygon: number[][];
  value: string;
}

export interface DocumentType {
  confidence: number;
  value: string;
}

export interface LineItem {
  confidence: number;
  description: string;
  polygon: number[][];
  quantity: number;
  total_amount: number;
  unit_price: number;
}

export interface Locale {
  confidence: number;
  country: string;
  currency: string;
  language: string;
  value: string;
}

export interface Orientation {
  confidence: number;
  degrees: number;
}

export interface Subcategory {
  confidence: number;
  value: string;
}

export interface SupplierAddress {
  confidence: number;
  polygon: number[][];
  value: string;
}

export interface SupplierCompanyRegistration {
  confidence: number;
  polygon: number[][];
  type: string;
  value: string;
}

export interface SupplierName {
  confidence: number;
  polygon: number[][];
  raw_value: any;
  value: any;
}

export interface SupplierPhoneNumber {
  confidence: number;
  polygon: number[][];
  value: string;
}

export interface Tax {
  base: number;
  code: string;
  confidence: number;
  polygon: number[][];
  rate: any;
  value: number;
}

export interface Time {
  confidence: number;
  polygon: number[][];
  value: string;
}

export interface Tip {
  confidence: number;
  polygon: number[][];
  value: number;
}

export interface TotalAmount {
  confidence: number;
  polygon: number[][];
  value: number;
}

export interface TotalNet {
  confidence: number;
  polygon: number[][];
  value: number;
}

export interface TotalTax {
  confidence: number;
  polygon: number[][];
  value: number;
}

export interface Prediction2 {
  category: Category2;
  date: Date2;
  document_type: DocumentType2;
  line_items: LineItem2[];
  locale: Locale2;
  subcategory: Subcategory2;
  supplier_address: SupplierAddress2;
  supplier_company_registrations: SupplierCompanyRegistration2[];
  supplier_name: SupplierName2;
  supplier_phone_number: SupplierPhoneNumber2;
  taxes: Tax2[];
  time: Time2;
  tip: Tip2;
  total_amount: TotalAmount2;
  total_net: TotalNet2;
  total_tax: TotalTax2;
}

export interface Category2 {
  confidence: number;
  value: string;
}

export interface Date2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: string;
}

export interface DocumentType2 {
  confidence: number;
  value: string;
}

export interface LineItem2 {
  confidence: number;
  description: string;
  page_id: number;
  polygon: number[][];
  quantity: number;
  total_amount: number;
  unit_price: number;
}

export interface Locale2 {
  confidence: number;
  country: string;
  currency: string;
  language: string;
  value: string;
}

export interface Subcategory2 {
  confidence: number;
  value: string;
}

export interface SupplierAddress2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: string;
}

export interface SupplierCompanyRegistration2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  type: string;
  value: string;
}

export interface SupplierName2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  raw_value: any;
  value: any;
}

export interface SupplierPhoneNumber2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: string;
}

export interface Tax2 {
  base: number;
  code: string;
  confidence: number;
  page_id: number;
  polygon: number[][];
  rate: any;
  value: number;
}

export interface Time2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: string;
}

export interface Tip2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: number;
}

export interface TotalAmount2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: number;
}

export interface TotalNet2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: number;
}

export interface TotalTax2 {
  confidence: number;
  page_id: number;
  polygon: number[][];
  value: number;
}

export interface Product {
  features: string[];
  name: string;
  version: string;
}

export interface Ocr {}

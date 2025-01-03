import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';


@Component({
  selector: 'app-page-one',
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.scss']
})
export class PageOneComponent implements OnInit {

  public formOne!: FormGroup;
  public tableData : any;
  columns = ['lrNum', 'lrDate','ownBy',  'vehicalNo', 'loadDate', 'consignor', 'consignee', 'account', 'product', 'qtyLoad' , 'from',  'to', 'delete'];
  dropDown = [
    {value: 'own', viewValue: 'Own'},
    {value: 'other', viewValue: 'Other'},
  ];
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];

  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.formOne = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      lrDate: new FormControl('',[Validators.required]),
      ownBy:  new FormControl('',[Validators.required]),
      vehicalNo: new FormControl('',[Validators.required]),
      loadDate: new FormControl('',[Validators.required]),
      consignor: new FormControl('',[Validators.required]),
      consignee: new FormControl('',[Validators.required]),
      account: new FormControl('',[Validators.required]),
      product: new FormControl('',[Validators.required]),
      qtyLoad: new FormControl('',[Validators.required]),
      from: new FormControl('',[Validators.required]),
      to: new FormControl('',[Validators.required]),
    });
    this.apiSrv.getFormOneData().pipe().subscribe((resp)=> this.tableData = resp);
    this.formOne.get('lrNum')?.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filterSuggestions(value))
    ).subscribe((val)=> this.filteredSuggestions = val);
  }

  private _filterSuggestions(value: string) {
    if(value){
      const filterValue = value.toLowerCase();
      return this.tableData.filter((resp:any) => resp.lrNum.toLowerCase().includes(filterValue));
    }
  }

  postValue(){
    if(this.selectedValuePresent){
      this.apiSrv.putFormOneData(this.formOne.get('lrNum')?.value, this.formOne.getRawValue()).subscribe((resp)=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
      },
      error=>console.log(error)
    );
    this.formOne.reset();
    this.selectedSuggestion=[];
    }
    else{
      this.apiSrv.postFormOneData(this.formOne.getRawValue()).subscribe(resp=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
      },
      error=>this.apiSrv.show(error.error));
      this.formOne.reset();
      this.selectedSuggestion=[];
    }
  }

  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formOne.patchValue({
        lrDate: this.selectedSuggestion[0]?.lrDate,
        ownBy:  this.selectedSuggestion[0]?.ownBy,
        vehicalNo: this.selectedSuggestion[0]?.vehicalNo,
        loadDate: this.selectedSuggestion[0]?.loadDate,
        consignor: this.selectedSuggestion[0]?.consignor,
        consignee: this.selectedSuggestion[0]?.consignee,
        account: this.selectedSuggestion[0]?.account,
        product: this.selectedSuggestion[0]?.product,
        qtyLoad: this.selectedSuggestion[0]?.qtyLoad,
        from: this.selectedSuggestion[0]?.from,
        to: this.selectedSuggestion[0]?.to
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formOne.get('lrNum')?.value;
    this.formOne.reset();
    this.selectedValuePresent = false;
    this.formOne.patchValue({lrNum: lrNum});
  }


  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe(resp=>{
      this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
    });
  }

  exportToCSV(){
    const csv = this.apiSrv.convertJsonToCsv(this.tableData);
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'formone.csv');
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}

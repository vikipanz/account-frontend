import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-page-five',
  templateUrl: './page-five.component.html',
  styleUrls: ['./page-five.component.scss']
})
export class PageFiveComponent implements OnInit {
  public formFive!: FormGroup;
  columns = [
    'lrNum',
    'loadDate',
    'vehicalNo',
    'dieselAmount',
    'dieselLtr',
    'remark',
    'others',
    'serviceBill',
    'fastTag',
    'secondRemark',
    'delete'
  ]
  tableData: any;
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];


  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.formFive = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      loadDate: new FormControl('',[Validators.required]),
      vehicalNo: new FormControl('',[Validators.required]),
      dieselAmount: new FormControl('',[Validators.required]),
      dieselLtr: new FormControl('',[Validators.required]),
      remark: new FormControl('',[Validators.required]),
      others: new FormControl('',[Validators.required]),
      serviceBill: new FormControl('',[Validators.required]),
      fastTag: new FormControl('',[Validators.required]),
      secondRemark: new FormControl('',[Validators.required]),
    });
    this.apiSrv.getFormOneData().subscribe(resp=>this.tableData = resp);
    this.formFive.get('lrNum')?.valueChanges.pipe(
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

  getValue(){
    if(this.selectedValuePresent){
      this.apiSrv.putFormOneData(this.formFive.get('lrNum')?.value, this.formFive.getRawValue()).subscribe((resp)=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
      },
      error=>console.log(error)
    );
    this.formFive.reset();
    this.selectedSuggestion=[];
    }
    else{
      this.apiSrv.postFormOneData(this.formFive.getRawValue()).subscribe(resp=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
      },
      error=>console.log(error.message));
      this.formFive.reset();
      this.selectedSuggestion=[];
    }
  }

  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formFive.patchValue({
        loadDate: this.selectedSuggestion[0]?.loadDate,
        vehicalNo: this.selectedSuggestion[0]?.vehicalNo,
        dieselAmount: this.selectedSuggestion[0]?.dieselAmount,
        dieselLtr: this.selectedSuggestion[0]?.dieselLtr,
        remark: this.selectedSuggestion[0]?.remark,
        others: this.selectedSuggestion[0]?.others,
        serviceBill: this.selectedSuggestion[0]?.serviceBill,
        fastTag: this.selectedSuggestion[0]?.fastTag,
        secondRemark: this.selectedSuggestion[0]?.secondRemark,
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formFive.get('lrNum')?.value;
    this.formFive.reset();
    this.selectedValuePresent = false;
    this.formFive.patchValue({lrNum: lrNum});
  }


  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe(resp=>{
      this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-page-three',
  templateUrl: './page-three.component.html',
  styleUrls: ['./page-three.component.scss']
})
export class PageThreeComponent implements OnInit {

  public formThree!: FormGroup;
  columns = [
    'lrNum',
    'lrCheckedDate',
    'reportingDate',
    'unloadDate',
    'unloadNetWt',
    'shortage',
    'shortagePercent',
    'delete'
  ]
  tableData: any;
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];

  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.getFormThreeValues();
    this.formThree = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      lrCheckedDate: new FormControl('',[Validators.required]),
      reportingDate: new FormControl('',[Validators.required]),
      unloadDate: new FormControl('',[Validators.required]),
      unloadnetWt: new FormControl('',[Validators.required]),
      shortage: new FormControl('',[Validators.required]),
      shortagePercent: new FormControl('',[Validators.required])
    });
    this.formThree.get('lrNum')?.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filterSuggestions(value))
    ).subscribe((val)=> this.filteredSuggestions = val);
  }

  getFormThreeValues(){
    this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData=resp);
  }

  private _filterSuggestions(value: string) {
    if(value){
      const filterValue = value.toLowerCase();
      return this.tableData.filter((resp:any) => resp.lrNum.toLowerCase().includes(filterValue));
    }
  }

  postFormThreeData(){
    if(this.selectedValuePresent){
      this.apiSrv.putFormOneData(this.formThree.get('lrNum')?.value, this.formThree.getRawValue()).subscribe((resp)=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
      },
      error=>console.log(error)
    );
    this.formThree.reset();
    this.selectedSuggestion=[];
    }
    else{
      this.apiSrv.postFormOneData(this.formThree.getRawValue()).subscribe(resp=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
      },
      error=>console.log(error.message));
      this.formThree.reset();
      this.selectedSuggestion=[];
    }
  }

  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formThree.patchValue({
        lrCheckedDate:this.selectedSuggestion[0]?.lrCheckedDate,
        reportingDate:this.selectedSuggestion[0]?.reportingDate,
        unloadDate:this.selectedSuggestion[0]?.unloadDate,
        unloadnetWt:this.selectedSuggestion[0]?.unloadnetWt,
        shortage: this.selectedSuggestion[0]?.shortage,
        shortagePercent:this.selectedSuggestion[0]?.shortagePercent
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formThree.get('lrNum')?.value;
    this.formThree.reset();
    this.selectedValuePresent = false;
    this.formThree.patchValue({lrNum: lrNum});
  }


  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe(resp=>{
      this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
    });
  }
}

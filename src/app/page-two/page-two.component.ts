import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';
import { Lr } from '../lr.interface';

@Component({
  selector: 'app-page-two',
  templateUrl: './page-two.component.html',
  styleUrls: ['./page-two.component.scss']
})
export class PageTwoComponent implements OnInit {

  public formTwo!: FormGroup;
  public tableData : any;
  columns = ['lrNum','lrDate', 'vehicalNo', 'lrCheckedDate', 'qtyUnloaded' , 'shortage' , 'allowance' , 'allowanceType' , 'shortageToBeDeducted' , 'delete'];
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];

  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.getFormTwoValues();
    this.formTwo = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      lrDate: new FormControl('',[Validators.required]),
      vehicalNo: new FormControl('',[Validators.required]),
      lrCheckedDate: new FormControl('',[Validators.required]),
      qtyUnloaded: new FormControl('',[Validators.required]),
      shortage: new FormControl('',[Validators.required]),
      allowance: new FormControl('',[Validators.required]),
      allowanceType: new FormControl('',[Validators.required]),
      shortageToBeDeducted:new FormControl('',[Validators.required]),
    });
    this.formTwo.get('lrNum')?.valueChanges.pipe(
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


  getFormTwoValues(){
    this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
  }

  postFormTwoData(){
    let formValue = this.formTwo.getRawValue();
    if(this.selectedValuePresent){
      this.apiSrv.putFormOneData(this.formTwo.get('lrNum')?.value, formValue).subscribe((resp)=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>{
          if(resp){
            this.tableData = resp;
          }
        }) 
      },
      error=>console.log(error)
    );
    this.formTwo.reset();
    this.selectedSuggestion=[];
    }
    else{
      this.apiSrv.postFormOneData(formValue).subscribe(resp=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
      },
      error=>console.log(error.message));
      this.formTwo.reset();
      this.selectedSuggestion=[];
    }
  }

  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formTwo.patchValue({
        lrDate: this.selectedSuggestion[0]?.lrDate,
        vehicalNo: this.selectedSuggestion[0]?.vehicalNo,
        lrCheckedDate: this.selectedSuggestion[0]?.lrCheckedDate,
        qtyUnloaded: this.selectedSuggestion[0]?.qtyUnloaded,
        shortage: this.selectedSuggestion[0]?.shortage,
        allowance: this.selectedSuggestion[0]?.allowance,
        allowanceType: this.selectedSuggestion[0]?.allowanceType,
        shortageToBeDeducted:this.selectedSuggestion[0]?.shortageToBeDeducted,
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formTwo.get('lrNum')?.value;
    this.formTwo.reset();
    this.selectedValuePresent = false;
    this.formTwo.patchValue({lrNum: lrNum});
  }

  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe();
  }

}

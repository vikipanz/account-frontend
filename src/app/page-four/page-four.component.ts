import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallApiService } from '../call-api.service';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-page-four',
  templateUrl: './page-four.component.html',
  styleUrls: ['./page-four.component.scss']
})
export class PageFourComponent implements OnInit {

  public formFour!: FormGroup;
  columns = [
    'lrNum',
    'lrDate',
    'vehicalNo',
    'subcontratorName',
    'subcontratorRate',
    'subContratorAdvance',
    'subContratorDiesel',
    'delete'
  ]
  tableData: any;
  filteredSuggestions: any[] = [];
  selectedValuePresent = false;
  selectedSuggestion: any[] = [];

  constructor(private formBuilder: FormBuilder, private apiSrv: CallApiService) { }

  ngOnInit(): void {
    this.formFour = this.formBuilder.group({
      lrNum: new FormControl('',[Validators.required]),
      lrDate: new FormControl('',[Validators.required]),
      vehicalNo: new FormControl('',[Validators.required]),
      subcontratorName: new FormControl('', [Validators.required]),
      subcontratorRate: new FormControl('', [Validators.required]),
      subContratorAdvance: new FormControl('', [Validators.required]),
      subContratorDiesel: new FormControl('',[Validators.required])
    });
    this.apiSrv.getFormOneData().subscribe(resp=>this.tableData=resp);
    this.formFour.get('lrNum')?.valueChanges.pipe(
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
      this.apiSrv.putFormOneData(this.formFour.get('lrNum')?.value, this.formFour.getRawValue()).subscribe((resp)=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
      },
      error=>console.log(error)
    );
    this.formFour.reset();
    this.selectedSuggestion=[];
    }
    else{
      this.apiSrv.postFormOneData(this.formFour.getRawValue()).subscribe(resp=>{
        this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp)
      },
      (error)=>{
        this.apiSrv.show(error.error.error);
      });
      this.formFour.reset();
      this.selectedSuggestion=[];
    }
  }


  onLrNumSelected(event: any) {
    const selectedLrNum = event.option.value;
    this.selectedSuggestion = this.tableData.filter((suggestion: any) => suggestion.lrNum === selectedLrNum);
    if (this.selectedSuggestion) {
      this.formFour.patchValue({
        lrDate:this.selectedSuggestion[0]?.lrDate,
        vehicalNo:this.selectedSuggestion[0]?.vehicalNo,
        subcontratorName:this.selectedSuggestion[0]?.subcontratorName,
        subcontratorRate:this.selectedSuggestion[0]?.subcontratorRate,
        subContratorAdvance:this.selectedSuggestion[0]?.subContratorAdvance,
        subContratorDiesel:this.selectedSuggestion[0]?.subContratorDiesel
      });
      this.selectedValuePresent = true;
    }
    else{
      this.selectedValuePresent = false;
    }
  }

  onLrInput(){
    const lrNum = this.formFour.get('lrNum')?.value;
    this.formFour.reset();
    this.selectedValuePresent = false;
    this.formFour.patchValue({lrNum: lrNum});
  }


  deleteRow(record: any){
    this.apiSrv.deleteRecord(record.lrNum).subscribe(resp=>{
      this.apiSrv.getFormOneData().subscribe((resp)=>this.tableData = resp) 
    });
  }
}

import { OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomFieldConfig, DataService, FormInputComponent } from '@vendure/admin-ui/core';
export declare class ProductCollectionCustomFieldComponent implements FormInputComponent<CustomFieldConfig>, OnInit {
    private dataService;
    private cdr;
    private activatedRoute;
    isListInput?: boolean | undefined;
    readonly: boolean;
    formControl: FormControl;
    config: CustomFieldConfig;
    allCollections: any[];
    options: any[];
    id: string;
    constructor(dataService: DataService, cdr: ChangeDetectorRef, activatedRoute: ActivatedRoute);
    ngOnInit(): void;
    onChange(event: any): void;
}

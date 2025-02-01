import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Galleria } from 'primeng/galleria';
import { OverlayPanel } from 'primeng/overlaypanel';

import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Refeicao } from 'src/app/api/refeicao';
import { Registro } from 'src/app/api/registro';
import { PhotoService } from 'src/app/demo/service/photo.service';
import { FoodService } from 'src/app/service/alimento.service';
import { SnackService } from 'src/app/service/refeicao.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './list-registros.component.html',
    providers: [ConfirmationService, PhotoService],
})
export class ListRegistrosComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('op') overlayPanel!: OverlayPanel;
    private unsubscribe = new Subject<void>();
    food: Alimento[] = [];
    register: Registro[] = [];
    listSnackies!: Refeicao[];
    images: any[] = [];

    constructor(
        private router: Router,
        public foodService: FoodService,
        public snackService: SnackService,
        @Inject(PLATFORM_ID) private platformId: any,
        private photoService: PhotoService,
        private cd: ChangeDetectorRef,

        public registerService: RegisterService
    ) {
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
            });
        this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.listSnackies = res;
            });

        this.sortOptions = [
            { label: 'Data Ascendente', value: 'asc' },
            { label: 'Data Descendente', value: 'desc' },
        ];
        this.selectedSortOption = 'asc';
    }

    ngOnInit() {
        this.registerService.loadButtons('list');
        this.images = this.register.map((register) => {
            const imageSrc = this.getImageForRefeicao(
                register.descricao_refeicao
            );
            return {
                itemImageSrc: imageSrc,
                thumbnailImageSrc: imageSrc,
                title: register.descricao_refeicao,
                data: register.data,
                porcao: register.nutrientes_totais.qtd,
                calorias: register.nutrientes_totais.caloria,
                alimentos: register.alimentos
                    .map((alimento) => alimento.descricao)
                    .join(', '),
            };
        });

        this.bindDocumentListeners();
    }

    getImageForRefeicao(descricao: string): string {
        const imageMap = {
            Jantar: '../../../../assets/layout/images/jantar.jpg',
            'Café da manhã': '../../../../assets/layout/images/cafeManha.jpg',
            'Lanche da tarde':
                '../../../../assets/layout/images/lanche-da-tarde.jpg',
            Ceia: '../../../../assets/layout/images/ceia.jpg',
            Almoço: '../../../../assets/layout/images/almoco.jpeg',
        };
        return (
            imageMap[descricao] || '../../../../assets/layout/images/img01.png'
        );
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.unbindDocumentListeners();
    }

    navigateToCompanyEdit(id: number) {
        this.router.navigate([`/registros/registro/${id}`]);
    }

    getAlimentosDescription(alimentos: any[]): string {
        const descriptions = alimentos.map((alimento) => alimento.descricao);
        const descriptionsWithBreaks = descriptions.map(
            (desc) => desc + '<br>'
        );
        return descriptionsWithBreaks.join('');
    }

    sortOptions: any[];
    selectedSortOption: string;

    modalOrdenacao: boolean = false;

    onSortChange(event: any) {
        this.sortRegistersByDate(event.value);
    }

    sortRegistersByDate(order: string) {
        this.register.sort((a, b) => {
            const dateA = new Date(a.data).getTime();
            const dateB = new Date(b.data).getTime();
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    showThumbnails: boolean | undefined;

    fullscreen: boolean = false;

    activeIndex: number = 0;

    onFullScreenListener: any;

    @ViewChild('galleria') galleria: Galleria | undefined;

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];
    onThumbnailButtonClick() {
        this.showThumbnails = !this.showThumbnails;
    }

    toggleFullScreen() {
        if (this.fullscreen) {
            this.closePreviewFullScreen();
        } else {
            this.openPreviewFullScreen();
        }

        this.cd.detach();
    }

    openPreviewFullScreen() {
        let elem =
            this.galleria?.element.nativeElement.querySelector('.p-galleria');
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem['mozRequestFullScreen']) {
            /* Firefox */
            elem['mozRequestFullScreen']();
        } else if (elem['webkitRequestFullscreen']) {
            /* Chrome, Safari & Opera */
            elem['webkitRequestFullscreen']();
        } else if (elem['msRequestFullscreen']) {
            /* IE/Edge */
            elem['msRequestFullscreen']();
        }
    }

    onFullScreenChange() {
        this.fullscreen = !this.fullscreen;
        this.cd.detectChanges();
        this.cd.reattach();
    }

    closePreviewFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document['mozCancelFullScreen']) {
            document['mozCancelFullScreen']();
        } else if (document['webkitExitFullscreen']) {
            document['webkitExitFullscreen']();
        } else if (document['msExitFullscreen']) {
            document['msExitFullscreen']();
        }
    }

    bindDocumentListeners() {
        this.onFullScreenListener = this.onFullScreenChange.bind(this);
        document.addEventListener(
            'fullscreenchange',
            this.onFullScreenListener
        );
        document.addEventListener(
            'mozfullscreenchange',
            this.onFullScreenListener
        );
        document.addEventListener(
            'webkitfullscreenchange',
            this.onFullScreenListener
        );
        document.addEventListener(
            'msfullscreenchange',
            this.onFullScreenListener
        );
    }

    unbindDocumentListeners() {
        document.removeEventListener(
            'fullscreenchange',
            this.onFullScreenListener
        );
        document.removeEventListener(
            'mozfullscreenchange',
            this.onFullScreenListener
        );
        document.removeEventListener(
            'webkitfullscreenchange',
            this.onFullScreenListener
        );
        document.removeEventListener(
            'msfullscreenchange',
            this.onFullScreenListener
        );
        this.onFullScreenListener = null;
    }

    galleriaClass() {
        return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
    }

    fullScreenIcon() {
        return `pi ${
            this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'
        }`;
    }
}

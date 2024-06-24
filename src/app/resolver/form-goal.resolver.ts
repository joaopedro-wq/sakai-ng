import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';;
import { GoalService } from '../service/metas.service';
import { NutritionService } from '../service/recomendacao.service';

export const formGoalResolver: ResolveFn<boolean> = (route, state) => {
  
    let goalService = inject(GoalService);
    let nutritionService = inject(NutritionService);
    
    let id = route.params['id'];
    if (id) goalService.loadGoal(id).subscribe();
    nutritionService.loadNutritions().subscribe();
    goalService.loadGoals().subscribe();
    

    return true;
};

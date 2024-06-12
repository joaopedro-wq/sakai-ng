import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';;
import { GoalService } from '../service/metas.service';

export const formGoalResolver: ResolveFn<boolean> = (route, state) => {
  
    let goalService = inject(GoalService);
    
    let id = route.params['id'];
    if (id) goalService.loadGoal(id).subscribe();
    

    return true;
};

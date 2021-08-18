package com.oet.application.usecases.manageClasses.DTO;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentAverages extends Object{

    private Long id;

    private String name;

    private String surname;

    private Double averages;

    private Double totalAverage;

    private Long count;

    public StudentAverages(Long id,String name,String surname,Double averages,Double totalAverage,Long count){
        this.id=id;
        this.name=name;
        this.surname=surname;
        this.averages=averages;
        this.totalAverage=totalAverage;
        this.count=count;
    }
    @Override
    public boolean equals(Object object){
        if(this.id==id)
            return true;
        else
            return false;
    }
}

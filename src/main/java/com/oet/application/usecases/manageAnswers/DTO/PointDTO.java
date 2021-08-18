package com.oet.application.usecases.manageAnswers.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class PointDTO {

    private final float point;

    private final float maxPoint;

    public PointDTO add(PointDTO pointDTO) {
        return new PointDTO(this.point+pointDTO.point, this.maxPoint+pointDTO.maxPoint);
    }
}

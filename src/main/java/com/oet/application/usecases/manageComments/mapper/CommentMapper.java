package com.oet.application.usecases.manageComments.mapper;

import com.oet.application.usecases.manageComments.dto.CommentDTO;
import org.mapstruct.Mapper;
import com.oet.application.usecases.manageComments.entity.Comment;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentDTO mapToDTO(Comment comment);
    List<CommentDTO> mapToDTO(List<Comment> commentList);
    Comment mapToEntity(CommentDTO commentDTO);
    List<Comment> mapToEntity(List<CommentDTO> commentDTOList);
}
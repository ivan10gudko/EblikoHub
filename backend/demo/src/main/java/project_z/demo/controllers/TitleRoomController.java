package project_z.demo.controllers;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.TitleDtos.TitleRoomUpdateDto;

@Controller
@RequiredArgsConstructor
public class TitleRoomController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/room/{roomId}/change")
    public void handleUpdate(@DestinationVariable Long roomId, 
                             @Payload TitleRoomUpdateDto update) {
        System.out.println("Update for Room [" + roomId + "] Action: " + update.getAction() + update.getNewValue());
        String destination = "/topic/room/" + roomId;
        messagingTemplate.convertAndSend(destination, update);
        
    }

}
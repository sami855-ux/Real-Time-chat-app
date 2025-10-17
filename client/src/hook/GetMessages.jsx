import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../service/messages";

export const useMessages = (conversationId) => {
  const [messages, setMessages] = useState({
    messages: [],
    message: "",
    success: false,
  });

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId, // only run the query if conversationId is available
  });

  // Update state when data changes
  useEffect(() => {
    console.log(data);
    if (data) {
      setMessages(data);
    }
  }, [data]);

  return {
    messages,
    setMessages,
    loading: isLoading,
    refetch,
    isError,
    error,
  };
};

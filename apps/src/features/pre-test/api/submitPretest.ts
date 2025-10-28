import { supabase } from '@/src/services/supabase';
import type { PretestAnswer, UUID } from '../models';

// Save individual answer as it's completed
export async function saveIndividualAnswer(opts: {
  test_session_id: UUID;
  answer: PretestAnswer;
  version?: number;
}): Promise<UUID> {
  
  const version = opts.version || 1;
  
  // First, check if a response already exists for this question
  const { data: existingResponse, error: checkError } = await supabase
    .from('app_pretest_responses')
    .select('id')
    .eq('test_session_id', opts.test_session_id)
    .eq('question_id', opts.answer.question_id)
    .single();

  let responseId: UUID;

  if (existingResponse) {
    // Update existing response
    responseId = existingResponse.id;
    
    // Delete existing choices for this response
    const { error: deleteError } = await supabase
      .from('app_pretest_response_choices')
      .delete()
      .eq('response_id', responseId);
    
    if (deleteError) {
      console.warn('Error deleting existing choices:', deleteError);
    }
  } else {
    // Create new response
    const { data: newResponse, error: responseError } = await supabase
      .from('app_pretest_responses')
      .insert({
        test_session_id: opts.test_session_id,
        question_id: opts.answer.question_id,
        version: version,
      })
      .select('id')
      .single();

    if (responseError) {
      console.error('Error creating response:', responseError);
      throw responseError;
    }
    
    responseId = newResponse.id;
  }

  // Create response choices
  const responseChoices: Array<{
    response_id: UUID;
    choice_id: UUID;
  }> = [];

  if (opts.answer.type === 'single') {
    responseChoices.push({
      response_id: responseId,
      choice_id: opts.answer.choice_id,
    });
  } else if (opts.answer.type === 'multi') {
    for (const choiceId of opts.answer.choice_ids) {
      responseChoices.push({
        response_id: responseId,
        choice_id: choiceId,
      });
    }
  }

  // Insert response choices
  if (responseChoices.length > 0) {
    const { error: choicesError } = await supabase
      .from('app_pretest_response_choices')
      .insert(responseChoices);

    if (choicesError) {
      console.error('Error inserting response choices:', choicesError);
      throw choicesError;
    }
  }

  return responseId;
}

export async function submitPretestAnswers(opts: {
  test_session_id: UUID;
  answers: PretestAnswer[];
}) {
  
  const responses: Array<{
    test_session_id: UUID;
    question_id: UUID;
    version: number;
  }> = [];
  
  const responseChoices: Array<{
    response_id: UUID;
    choice_id: UUID;
  }> = [];

  // Process each answer
  for (const answer of opts.answers) {
    // Create response record for this question
    const responseData = {
      test_session_id: opts.test_session_id,
      question_id: answer.question_id,
      version: 1, // Assuming version 1 for now
    };
    
    responses.push(responseData);
  }

  // Insert all responses first
  const { data: insertedResponses, error: responseError } = await supabase
    .from('app_pretest_responses')
    .insert(responses)
    .select('id, question_id');

  if (responseError) {
    console.error('Error inserting responses:', responseError);
    throw responseError;
  }


  // Now create response choices
  for (const answer of opts.answers) {
    const response = insertedResponses.find(r => r.question_id === answer.question_id);
    if (!response) {
      console.warn('No response found for question:', answer.question_id);
      continue;
    }

    if (answer.type === 'single') {
      responseChoices.push({
        response_id: response.id,
        choice_id: answer.choice_id,
      });
    } else if (answer.type === 'multi') {
      for (const choiceId of answer.choice_ids) {
        responseChoices.push({
          response_id: response.id,
          choice_id: choiceId,
        });
      }
    }
  }

  // Insert response choices
  if (responseChoices.length > 0) {
    const { error: choicesError } = await supabase
      .from('app_pretest_response_choices')
      .insert(responseChoices);

    if (choicesError) {
      console.error('Error inserting response choices:', choicesError);
      throw choicesError;
    }
  }

  return insertedResponses.map(r => r.id);
}

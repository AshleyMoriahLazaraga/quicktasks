
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://doicyelsusmvleeegtgz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvaWN5ZWxzdXNtdmxlZWVndGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3MTgzMTUsImV4cCI6MjAzMDI5NDMxNX0._RN27zYgozqu7TJRA423MY5-RQ2YF2cW1aqH1pkIAUo'
;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
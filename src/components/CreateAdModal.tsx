import * as Dialog from '@radix-ui/react-dialog'
import { Check, GameController } from 'phosphor-react';
import { Input } from './Form/Input';
import * as Checkbox from '@radix-ui/react-checkbox'
import { useEffect, useState, FormEvent } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import axios from 'axios';

interface Game {
  id: string;
  title: string;
};

export const CreateAdModal = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [voice, setVoice] = useState(false);

  useEffect(() => { 
    axios('http://localhost:3333/games').then((response) => setGames(response.data))
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData)
    
    if (!data.name) {
      return;
    };

    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        "name" : data.name,
        "yearsPlaying" : Number(data.yearsPlaying),
        "discord" : data.discord,
        "weekDays" : days.map(Number),
        // "minStart" : data.minStart,
        // "minEnd" : data.minEnd,
        "useVoice" : voice,
      });

      alert('Anúncio criado com sucesso')
    } catch (err) {
      console.log(err)
      alert('Algo deu errado....')
    };
  };
  
  return (
    <Dialog.Portal>
      <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>

      <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-auto shadow-black/25'>
        <Dialog.Title className='text-3xl text-white font-black'>Publique um anúncio</Dialog.Title>
      
        <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="game" className='font-semibold'>Qual é o game?</label>
              <select 
                id='game' 
                name='game' 
                placeholder='Selecione o que você deseja jogar' 
                className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:z-0text-zinc-500 appearance-none' 
                defaultValue=""
              >
                  <option disabled value="">Selecione o que você deseja jogar</option>
                  {games.map(game => {
                    return (
                      <option key={game.id} value={game.id}>{game.title}</option>                          )
                  })}
              </select>
          </div>
          
          <div className='flex flex-col gap-2'>
            <label htmlFor="name">Seu nome ou nickname</label>
            <Input id='name' name='name' type="text" placeholder='Como te chamam dentro do game?'/>
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input type="number" id='yearsPlaying' name='yearsPlaying' placeholder='Tudo bem ser zero....' />
            </div>

            <div className='flex flex-col gap-2'>
              <label htmlFor="dsicord">Qual seu Discord?</label>
              <Input type="text" id='discord' name='discord' placeholder='Usuario#0000'/>
            </div>
          </div>

          <div className='flex gap-6'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="weekDays">Qaundo costuma jogar?</label>
                <ToggleGroup.Root 
                  type='multiple' 
                  className='grid grid-cols-4 gap-2'
                  onValueChange={setDays}
                >
                  <ToggleGroup.Item value='0' className={`w-8 h-8 rounded bg-zinc-900 ${days.includes('0') ? 'bg-violet-500' : ''}`} >D</ToggleGroup.Item>
                  <ToggleGroup.Item value='1' className={`w-8 h-8 rounded bg-zinc-900 ${days.includes('1') ? 'bg-violet-500' : ''}`} >S</ToggleGroup.Item>
                  <ToggleGroup.Item value='2' className={`w-8 h-8 rounded bg-zinc-900 ${days.includes('2') ? 'bg-violet-500' : ''}`} >T</ToggleGroup.Item>
                  <ToggleGroup.Item value='3' className={`w-8 h-8 rounded bg-zinc-900 ${days.includes('3') ? 'bg-violet-500' : ''}`} >Q</ToggleGroup.Item>
                  <ToggleGroup.Item value='4' className={`w-8 h-8 rounded bg-zinc-900 ${days.includes('4') ? 'bg-violet-500' : ''}`} >Q</ToggleGroup.Item>
                  <ToggleGroup.Item value='5' className={`w-8 h-8 rounded bg-zinc-900 ${days.includes('5') ? 'bg-violet-500' : ''}`} >S</ToggleGroup.Item>
                  <ToggleGroup.Item value='6' className={`w-8 h-8 rounded bg-zinc-900 ${days.includes('6') ? 'bg-violet-500' : ''}`} >S</ToggleGroup.Item>
                </ToggleGroup.Root>
            </div>

            <div className='flex flex-col gap-2 flex-1'>
              <label htmlFor="minStart">Qual seu horário do dia?</label>
              <div className='grid grid-cols-2 gap-2'>
                <Input type="time" id='minStart' name='minStart' placeholder='De'/>
                <Input type="time" id='minEnd' name='minEnd' placeholder='Até'/>
              </div>
            </div>
          </div>

          <label className='mt-2 flex gap-2 text-sm items-center'>
            <Checkbox.Root className='w-6 h-6 rounded bg-zinc-900 p-1' checked={voice} onCheckedChange={(checked) => {
              if (checked === true) {setVoice(true)} else {setVoice(false)}
            }}>
              <Checkbox.Indicator >
                <Check className='w-4 h-4 text-emerald-400'/>
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className='mt-4 flex justify-end gap-4'>
            <Dialog.Close 
              type='button'
              className='bg-zinc-500 px-5 h-12 rounded-md front-semibold hover:bg-zinc-600'>Cancelar</Dialog.Close >
            <button type='submit' className='bg-violet-500 px-5 h-12 rounded-md front-semibold flex items-center gap-3 hover:bg-violet-600'>
              <GameController className='w-6 h-6'/>
              Encontrar duo
            </button>
          </footer>
        </form>

    
      </Dialog.Content>

    </Dialog.Portal>
  )
};
